import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { LPOModel } from '../../models/l-p-o.model';

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
