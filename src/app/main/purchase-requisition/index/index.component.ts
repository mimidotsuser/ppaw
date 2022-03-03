import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faEllipsisV, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {
  PRStage,
  PurchaseRequestItemModel,
  PurchaseRequestLogModel,
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
    const a$ = this.prService.fetchMyRequests()
      .subscribe((value) => {
        this._requests.push(...value)
      });

    this.subscriptions.push(a$);
  }

  ngOnInit(): void {
  }

  get requests(): PurchaseRequestModel[] {
    return this._requests;
  }

  formatRequestId(requestId: number): string {
    return this.prService.formatRequestId(requestId);
  }

  aggregateRequestItemsQty(items: PurchaseRequestItemModel[]) {
    return items.reduce((acc, item) => {
      acc.requested += item.qty_requested;
      acc.verified += item.qty_verified;
      acc.approved += item.qty_approved;
      return acc;
    }, {requested: 0, verified: 0, approved: 0})
  }

  lastProcessInstance(req: PurchaseRequestModel) {

    //sort in reverse such that the latest equals first index
    const lastStage = [...req.logs].sort((a, b) => b.id - a.id)[ 0 ];

    const qty = this.aggregateRequestItemsQty(req.items);

    if (lastStage.stage === PRStage.CREATE) {
      return {stage: 'Checking/Verification', status: 'Pending verification'}
    }

    if (lastStage.stage === PRStage.VERIFY) {
      return {
        stage: qty.verified === 0 ? 'Complete' : 'Approval',
        status: qty.verified === 0 ? 'Rejected' : 'Pending Approval'
      }
    }

    if (lastStage.stage === PRStage.APPROVE) {
      return {stage: 'Complete', status: qty.verified === 0 ? 'Rejected' : 'Approved'}
    }

    return {stage: 'Unknown', status: 'Unknown'}
  }

  formatTimelineStageTitle(log: PurchaseRequestLogModel) {
    if (log.stage === PRStage.CREATE) {
      return 'Request Application Stage';
    }
    if (log.stage === PRStage.VERIFY) {
      return 'Request Verification/Checking Stage';
    }
    if (log.stage === PRStage.APPROVE) {
      return 'Request Approval Stage';
    }

    return 'Request Stage Unknown';
  }

  showRequestHistory(request: PurchaseRequestModel) {
    this.model = request;
    this.showRequestHistoryPopup = true;
  }

  export(request: PurchaseRequestModel) {}

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }
}
