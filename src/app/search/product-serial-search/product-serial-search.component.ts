import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductItemModel } from '../../models/product-serial.model';

@Component({
  selector: 'product-serial-search',
  templateUrl: './product-serial-search.component.html',
  styleUrls: ['./product-serial-search.component.scss']
})
export class ProductSerialSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/product-serials';
  @Input() customId: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ProductItemModel) => string {
    return (item: ProductItemModel) => `${item.serial_number}|${item?.product?.item_code || ''}`
  };

}
