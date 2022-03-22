import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  PRStage,
  PurchaseRequestItemModel,
  PurchaseRequestLogModel,
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
    this.prService.fetchPendingApproval()
      .subscribe((model) => this._purchaseRequests.push(...model))
    this.searchInput = this.fb.control('');
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

  getVerifierInfo(logs: PurchaseRequestLogModel[]): { name: string, when: string } {
    const obj = logs.find((log) => log.stage === PRStage.VERIFY);
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
