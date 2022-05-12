import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import {
  faEllipsisV,
  faExternalLinkAlt,
  faEye,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import {
  PurchaseOrderItemModel,
  PurchaseOrderModel
} from '../../../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  faEye = faEye;
  faFilePdf = faFilePdf;
  faEllipsisV = faEllipsisV;
  faExternalLinkAlt = faExternalLinkAlt;
  showLPOSummaryPopup = false;
  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  selectedModel: PurchaseOrderModel | null = null;
  private _requests: PurchaseOrderModel[] = []
  private _subscriptions: Subscription[] = [];

  constructor(private purchaseOrderService: PurchaseOrderService, private _route: ActivatedRoute) {
    this.loadPurchaseOrders()
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

  get requests(): PurchaseOrderModel[] {
    return this._requests;
  }

  get route() {return this._route}

  calcTotalPrice(request: PurchaseOrderModel): string {
    return request.items
      .reduce((acc, item) => acc += this.calcSubtotalPrice(item), 0)
      .toString();
  }

  calcSubtotalPrice(item: PurchaseOrderItemModel): number {
    return (item.uom?.unit || 0) * (item.qty || 0) * (item.unit_price || 0)
  }

  loadPurchaseOrders() {
    if (this.tableCountEnd <= this._requests.length
      || (this._requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }
    this.loadingMainContent = true;
    this.subSink = this.purchaseOrderService.fetch(this.pagination,
      {include: 'items,createdBy,rfq'})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this._requests = this._requests.concat(res.data);
        this.pagination.total = res.total;
      });
  }

  showPurchaseOrderSummary(request: PurchaseOrderModel) {
    this.selectedModel = request;
    this.showLPOSummaryPopup = true;
  }


  exportPurchaseOrder(request: PurchaseOrderModel) {
    this.subSink = this.purchaseOrderService.download(request);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
