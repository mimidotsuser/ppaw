import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV, faEye, faFilePdf, faFilter } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import {
  PRStage,
  PurchaseRequestActivityModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import { PurchaseRequestFiltersModel } from '../../../../models/filters.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  faEye = faEye
  faFilePdf = faFilePdf;
  faFilter = faFilter;
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  showRequestHistoryPopup = false
  selectedModel: PurchaseRequestModel | null = null;
  private _requests: PurchaseRequestModel[] = [];
  private _subscriptions: Subscription[] = [];
  purchaseRequestFilters?: PurchaseRequestFiltersModel;

  constructor(private purchaseRequisitionService: PurchaseRequisitionService,
              public route: ActivatedRoute) {
    this.loadRequests();
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

  get requests(): PurchaseRequestModel[] {
    return this._requests;
  }

  loadRequests() {
    if (this.tableCountEnd <= this._requests.length
      || (this._requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.purchaseRequisitionService
      .fetch({...this.pagination, ...this.purchaseRequestFilters || []})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this.pagination.total = res.total;
        this._requests = res.data;
      })
  }

  showRequestHistory(request: PurchaseRequestModel) {
    this.selectedModel = request;
    this.showRequestHistoryPopup = true;
  }

  export(request: PurchaseRequestModel) {
    this.subSink = this.purchaseRequisitionService.download(request)

  }


  stage(activityModel?: PurchaseRequestActivityModel) {
    return this.purchaseRequisitionService.stage(activityModel);
  }

  status(activityModel?: PurchaseRequestActivityModel) {
    return this.purchaseRequisitionService.status(activityModel);
  }

  formatTimelineStageTitle(log: PurchaseRequestActivityModel) {
    if (log.stage === PRStage.REQUEST_CREATED) {
      return 'Request Application Stage';
    }
    if (log.stage === PRStage.VERIFIED_OKAYED || log.stage === PRStage.VERIFIED_REJECTED) {
      return 'Request Verification Stage';
    }
    if (log.stage === PRStage.APPROVAL_OKAYED || log.stage === PRStage.APPROVAL_REJECTED) {
      return 'Request Approval Stage';
    }
    return 'Request Stage Unknown';
  }

  filtersChanged(filters?: PurchaseRequestFiltersModel) {
    this.purchaseRequestFilters = filters;
    this._requests = [];
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
