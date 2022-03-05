import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  faExternalLinkAlt,
  faEllipsisV,
  faEye,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { LPOModel } from '../../../models/l-p-o.model';
import { PurchaseOrderService } from '../services/purchase-order.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  lpoRequests: LPOModel[] = []
  selectedModel: LPOModel | null = null;
  showLPOSummaryPopup = false;
  faExternalLinkAlt = faExternalLinkAlt;
  faEllipsisV = faEllipsisV;
  faEye = faEye;
  faFilePdf = faFilePdf;
  private subscriptions: Subscription[] = [];

  constructor(private lpoService: PurchaseOrderService) { }

  ngOnInit(): void {
    const x = this.lpoService.fetchAll()
      .subscribe((v) => this.lpoRequests = v);
    this.subscriptions.push(x);
  }

  formatOrderId(id: number) {
    return `REQUEST-${String(id).padStart(4, '0')}`
  }

  aggregateOrderTotal(request: LPOModel): string {
    return request.items
      .reduce((acc, item) => acc += item.qty * item.unit_price, 0)
      .toString();
  }

  authorName(req: LPOModel) {
    return `${req.created_by?.first_name || ''} ${req.created_by?.last_name || ''}`
  }

  showLPOSummary(request: LPOModel) {
    this.selectedModel = request;
    this.showLPOSummaryPopup = true;
  }

  get selectedLPOVendor(): string {
    if (!this.selectedModel || !this.selectedModel.vendors
      || this.selectedModel.vendors.length === 0) {
      return '---'
    }
    return this.selectedModel.vendors[ 0 ].business_name;
  }

  exportPurchaseOrder(request: LPOModel) {

  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }

}
