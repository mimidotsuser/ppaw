import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  faEllipsisV,
  faExternalLinkAlt,
  faEye,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { RFQModel } from '../../../../models/r-f-q.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { RequestForQuotationService } from '../../services/request-for-quotation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEye = faEye;
  faFilePdf = faFilePdf;
  faEllipsisV = faEllipsisV;
  faExternalLinkAlt = faExternalLinkAlt;
  showRFQSummaryPopup = false;
  loadingMainContent = false;
  selectedModel: RFQModel | null = null;
  _rfqRequests: RFQModel[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _subscriptions: Subscription[] = [];


  constructor(private rfqService: RequestForQuotationService, private _route: ActivatedRoute) {
    this.loadRequestForQuotations();
  }

  ngOnInit(): void {

  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get requests() {
    return this._rfqRequests;
  }

  get route() {return this._route}

  loadRequestForQuotations() {
    if (this.tableCountEnd <= this.requests.length
      || (this.requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.rfqService
      .fetch(this.pagination, {include: 'purchaseOrder,createdBy,vendors,items,purchaseRequest'})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._rfqRequests = this._rfqRequests.concat(res.data);
        }
      })
  }

  showRFQSummary(request: RFQModel) {
    this.selectedModel = request;
    this.showRFQSummaryPopup = true;
  }

  exportRFQ(request: RFQModel) {
    this.subSink = this.rfqService.download(request);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}
