import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { PaginationModel } from '../../../../models/pagination.model';
import {
  PurchaseOrderItemModel,
  PurchaseOrderModel
} from '../../../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {

  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: PurchaseOrderModel;

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private purchaseOrderService: PurchaseOrderService) {
    this.loadRequest();
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

  get items(): PurchaseOrderItemModel[] {
    return !this.model?.items ? [] : this.model.items;
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get route() {return this._route}

  get purchaseOrderTotalPrice(): number {
    return this.items.reduce((acc, item) => {
      return acc += item.unit_price * item.qty;
    }, 0)
  }

  loadRequest() {
    this.loadingMainContent = true;
    this.subSink = this.purchaseOrderService.findById(this.route.snapshot.params[ 'id' ])
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model.items?.length;
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}
