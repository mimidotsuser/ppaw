import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  PRStage,
  PurchaseRequestActivityModel,
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { Subscription } from 'rxjs';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
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

  getVerifierInfo(logs: PurchaseRequestActivityModel[]): { name: string, when: string } {
    const obj = logs.find((log) => log.stage === PRStage.VERIFIED_OKAYED);
    if (!obj) {
      return {name: '', when: ''}
    }
    return {
      name: `${obj.created_by?.first_name || ''} ${obj.created_by?.last_name || ''}`,
      when: obj.created_at
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}
