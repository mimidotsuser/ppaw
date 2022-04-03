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

  path: string;

  constructor(private httpService: HttpService) {
    this.path = httpService.endpoint.purchaseOrders
  }

  ngOnInit(): void {
  }


  get outputFormatter(): (item: PurchaseOrderModel) => string {
    return (item: PurchaseOrderModel) => {
      return `${item.sn} ${item.created_by ? '| by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }

}
