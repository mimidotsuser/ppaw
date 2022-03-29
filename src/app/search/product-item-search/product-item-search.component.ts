import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductSerialModel } from '../../models/product-serial.model';
import { HttpService } from '../../core/services/http.service';
import { WarehouseModel } from '../../models/warehouse.model';

@Component({
  selector: 'product-item-typeahead-input[control],product-item-typeahead-input[controlName]',
  templateUrl: './product-item-search.component.html',
  styleUrls: ['./product-item-search.component.scss']
})
export class ProductItemSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId?: string;
  @Input() placeholder: string = 'Search serial number';
  @Input() warehouse?: WarehouseModel;
  @Input() outOfOrder?: boolean;


  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.productItems
  }

  get outputFormatter(): (item: ProductSerialModel) => string {
    return (item: ProductSerialModel) => {
      const extra = '|' + (item?.product?.item_code ? item.product.item_code : item.sn);
      return `${item.serial_number}${extra}`
    }
  };

  get queryParams(): { [ key: string ]: string | boolean } {
    let params: { [ key: string ]: string | boolean } = {search: '%s'}
    if (this.warehouse) {
      params = {warehouse_id: this.warehouse.id.toString(), ...params,}
    }
    if (this.outOfOrder === true || this.outOfOrder === false) {
      params = {outOfOrder: this.outOfOrder, ...params,}
    }

    return params;
  }

}
