import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  faEllipsisV,
  faExternalLinkAlt,
  faEye,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { PurchaseOrderModel } from '../../../models/purchase-order.model';
import { PurchaseOrderService } from '../services/purchase-order.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  lpoRequests: PurchaseOrderModel[] = []
  selectedModel: PurchaseOrderModel | null = null;
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

  aggregateOrderTotal(request: PurchaseOrderModel): string {
    return request.items
      .reduce((acc, item) => acc += item.qty * item.unit_price, 0)
      .toString();
  }

  authorName(req: PurchaseOrderModel) {
    return `${req.created_by?.first_name || ''} ${req.created_by?.last_name || ''}`
  }

  showLPOSummary(request: PurchaseOrderModel) {
    this.selectedModel = request;
    this.showLPOSummaryPopup = true;
  }



  exportPurchaseOrder(request: PurchaseOrderModel) {

  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }

}
