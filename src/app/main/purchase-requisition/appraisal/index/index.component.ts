import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PurchaseRequestModel } from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _requests: PurchaseRequestModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchInput: FormControl;

  constructor(private purchaseRequisitionService: PurchaseRequisitionService, private fb: FormBuilder) {
    this.loadRequests();
    this.searchInput = this.fb.control('');
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
    this.subSink = this.purchaseRequisitionService.fetchRequestsPendingVerification(this.pagination)
      .subscribe((res) => {
        this.pagination.total = res.total;
        this._requests = this._requests.concat(res.data);
      })
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}
