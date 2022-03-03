import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PurchaseRequestModel } from '../../../../models/purchase-request.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  searchInput = new FormControl();
  _purchaseRequests: Observable<PurchaseRequestModel[]> = new Observable<PurchaseRequestModel[]>();

  constructor() { }

  ngOnInit(): void {
  }

  get purchaseRequests(): Observable<PurchaseRequestModel[]> {
    return this._purchaseRequests;
  }

  formatRequestId(orderId: number): string {
    return ''
  }

  aggregateRequestQty(orderItem: string): number {
    return 0;
  }
}
