import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV, faFilter } from '@fortawesome/free-solid-svg-icons';
import { GoodsReceiptNoteService } from '../../services/goods-receipt-note.service';
import { PaginationModel } from '../../../../models/pagination.model';
import {
  GoodsReceiptNoteActivityModel,
  GoodsReceiptNoteModel,
  GRNReceiptNoteStage
} from '../../../../models/goods-receipt-note.model';
import { InspectionModel } from '../../../../models/inspection.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  faFilter = faFilter;
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _requests: GoodsReceiptNoteModel[] = [];
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;

  constructor(private goodsReceiptNoteService: GoodsReceiptNoteService, private fb: FormBuilder,
              private _route: ActivatedRoute) {
    this.searchInput = this.fb.control(null);
    this.loadRequests();
  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {this._subscriptions.push(v);}

  get tableCountStart() {return (this.pagination.page - 1) * this.pagination.limit}

  get tableCountEnd() {return this.pagination.page * this.pagination.limit}

  get requests(): GoodsReceiptNoteModel[] {return this._requests}

  get route() {return this._route}

  loadRequests() {
    if (this.tableCountEnd <= this._requests.length) {return;}

    this.loadingMainContent = true;
    this.subSink = this.goodsReceiptNoteService.fetch(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._requests = this._requests.concat(res.data);
          this.pagination.total = res.total;
        }
      })
  }

  stage(log?: GoodsReceiptNoteActivityModel): string {
    if (!log) {return '---'}
    if (log.stage === GRNReceiptNoteStage.REQUEST_CREATED) {
      return 'Inspection Stage';
    }

    if (log.stage === GRNReceiptNoteStage.INSPECTION_DONE) {
      return 'Approval Stage';
    }

    if (log.stage === GRNReceiptNoteStage.APPROVAL_OKAYED
      || log.stage === GRNReceiptNoteStage.APPROVAL_REJECTED) {
      return 'Complete';
    }

    return 'Unknown';
  }

  status(log?: GoodsReceiptNoteActivityModel): string {
    if (!log) {return '---'}

    if (log.stage === GRNReceiptNoteStage.REQUEST_CREATED ||
      log.stage === GRNReceiptNoteStage.INSPECTION_DONE) {
      return 'Pending';
    }

    if (log.stage === GRNReceiptNoteStage.APPROVAL_OKAYED
      || log.stage === GRNReceiptNoteStage.APPROVAL_REJECTED) {
      return 'Complete';
    }
    return 'Unknown';
  }

  canExportGRN(request: GoodsReceiptNoteModel) {
    return request.latest_activity &&
      request.latest_activity.stage === GRNReceiptNoteStage.APPROVAL_OKAYED
  }

  canExportRGA(request: GoodsReceiptNoteModel) {
    return request.has_rejected_items && request.latest_activity &&
      request.latest_activity.stage === GRNReceiptNoteStage.APPROVAL_OKAYED
  }


  exportGRN(request: GoodsReceiptNoteModel) {
    this.subSink = this.goodsReceiptNoteService.downloadGRN(request);
  }

  exportInspectionNote(request: InspectionModel) {
    this.subSink = this.goodsReceiptNoteService.downloadInspectionNote(request);

  }

  exportRGA(request: GoodsReceiptNoteModel) {
    this.subSink = this.goodsReceiptNoteService.downloadRGA(request);

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}
