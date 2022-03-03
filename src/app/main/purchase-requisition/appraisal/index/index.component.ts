import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  searchInput = new FormControl();
  _purchaseRequests: PurchaseRequestModel[] = [];
  subscriptions: Subscription[] = [];

  constructor(private prService: PurchaseRequisitionService) {
    this.prService.fetchPendingVerification()
      .subscribe((model) => this._purchaseRequests.push(...model))
  }

  ngOnInit(): void {
  }

  get purchaseRequests(): PurchaseRequestModel[] {
    return this._purchaseRequests;
  }

  formatRequestId(orderId: number): string {
    return this.prService.formatRequestId(orderId);
  }

  aggregateRequestItemsQty(items: PurchaseRequestItemModel[]) {
    return items.reduce((acc, item) => {
      acc.requested += item.qty_requested;
      acc.verified += item.qty_verified;
      acc.approved += item.qty_approved;
      return acc;
    }, {requested: 0, verified: 0, approved: 0})
  }


  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}
