import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PurchaseRequestModel } from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  loadingMainContent = true;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _requests: PurchaseRequestModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchInput: FormControl;

  constructor(private fb: FormBuilder,
              private purchaseRequisitionService: PurchaseRequisitionService,) {
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
    if (this.tableCountEnd <= this._requests.length
      || (this._requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.purchaseRequisitionService.fetchRequestsPendingApproval(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this.pagination.total = res.total;
        this._requests = res.data;
      })
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}
