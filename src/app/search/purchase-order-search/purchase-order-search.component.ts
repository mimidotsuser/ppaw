import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { PurchaseOrderModel } from '../../models/purchase-order.model';

@Component({
  selector: 'po-typeahead-input[control],po-typeahead-input[controlName]',
  templateUrl: './purchase-order-search.component.html',
  styleUrls: ['./purchase-order-search.component.scss']
})
export class PurchaseOrderSearchComponent implements OnInit {


  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId: string | undefined;
  @Input() placeholder = 'Search by PO No. or vendor name'
  @Input() with?: string;
  @Input() undeliveredOnly?: boolean;
  @Input() includeDeliveredItems?: boolean;

  path: string;

  constructor(private httpService: HttpService) {
    this.path = httpService.endpoint.purchaseOrders
  }

  ngOnInit(): void {
  }


  get outputFormatter(): (item: PurchaseOrderModel) => string {
    return (item: PurchaseOrderModel) => {
      return `${item.sn} ${item.vendor ? '| by ' : ''}` + `${item?.vendor?.name || ''}`
    }
  }

  get queryParams(): { [ key: string ]: string | boolean; } {
    let params: { [ key: string ]: string | boolean } = {search: '%s', include: 'createdBy,vendor'}
    if (this.with) {
      params = {include: this.with, ...params}
    }
    if (this.undeliveredOnly === true) {
      params = {undeliveredQtyOnly: true, ...params}
    }
    if (this.includeDeliveredItems === true) {
      params = {withDeliveredQty: true, ...params}
    }
    return params
  }
}
