import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faEllipsisV, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {
  PurchaseRequestActivityModel,
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../services/purchase-requisition.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  _requests: PurchaseRequestModel[] = [];
  showRequestHistoryPopup = false
  model: PurchaseRequestModel | null = null;
  subscriptions: Subscription[] = [];
  faEllipsisV = faEllipsisV;
  faEye = faEye
  faFilePdf = faFilePdf;

  constructor(private prService: PurchaseRequisitionService) {

  }

  ngOnInit(): void {
  }

  get requests(): PurchaseRequestModel[] {
    return this._requests;
  }

  aggregateRequestItemsQty(items: PurchaseRequestItemModel[]) {
    return items.reduce((acc, item) => {
      acc.requested += item.requested_qty;
      acc.verified += item.verified_qty ? item.verified_qty : -1;
      acc.approved += item.approved_qty ? item.approved_qty : -1;
      return acc;
    }, {requested: 0, verified: 0, approved: 0})
  }


  showRequestHistory(request: PurchaseRequestModel) {
    this.model = request;
    this.showRequestHistoryPopup = true;
  }

  export(request: PurchaseRequestModel) {}

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }

  stage(activityModel?: PurchaseRequestActivityModel) {
    return this.prService.stage(activityModel);
  }

  status(activityModel?: PurchaseRequestActivityModel) {
    return this.prService.status(activityModel);
  }

  formatTimelineStageTitle(log: PurchaseRequestActivityModel) {
    return this.prService.formatTimelineStageTitle(log)
  }
}
