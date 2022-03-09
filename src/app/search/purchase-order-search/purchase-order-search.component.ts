import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { PurchaseRequestModel } from '../../models/purchase-request.model';
import { LPOModel } from '../../models/l-p-o.model';

@Component({
  selector: 'purchase-order-search',
  templateUrl: './purchase-order-search.component.html',
  styleUrls: ['./purchase-order-search.component.scss']
})
export class PurchaseOrderSearchComponent implements OnInit {


  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/purchase-orders';
  @Input() customId: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  formatRequestId(id: number) {
    return `REQUEST-${String(id).padStart(4, '0')}`
  }

  get outputFormatter(): (item: LPOModel) => string {
    return (item: LPOModel) => {
      return `${this.formatRequestId(item.order_id)} ${item.created_by ? '| by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }

}
