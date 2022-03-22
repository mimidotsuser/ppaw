import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductSerialModel } from '../../models/product-serial.model';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'product-item-typeahead-input[control],product-item-typeahead-input[controlName]',
  templateUrl: './product-item-search.component.html',
  styleUrls: ['./product-item-search.component.scss']
})
export class ProductItemSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId: string | undefined;
  @Input() editable = false;
  path: string;

  constructor(private httpService: HttpService) {
    this.path = httpService.endpoint.productItems
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ProductSerialModel) => string {
    return (item: ProductSerialModel) => `${item.serial_number}|${item?.product?.item_code || ''}`
  };

}
