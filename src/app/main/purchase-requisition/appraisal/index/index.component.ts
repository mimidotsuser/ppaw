import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  searchInput: FormControl;
  _purchaseRequests: PurchaseRequestModel[] = [];
  subscriptions: Subscription[] = [];

  constructor(private prService: PurchaseRequisitionService, private fb: FormBuilder) {
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }

  get purchaseRequests(): PurchaseRequestModel[] {
    return this._purchaseRequests;
  }

  aggregateRequestItemsQty(items: PurchaseRequestItemModel[]) {
    return items.reduce((acc, item) => {
      acc.requested += item.requested_qty;
      acc.verified += item.verified_qty?item.verified_qty:-1;
      acc.approved += item.approved_qty?item.approved_qty:-1;
      return acc;
    }, {requested: 0, verified: 0, approved: 0})
  }


  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}
