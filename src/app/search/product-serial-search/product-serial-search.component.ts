import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductSerialModel } from '../../models/product-serial.model';

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
  @Input() editable = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ProductSerialModel) => string {
    return (item: ProductSerialModel) => `${item.serial_number}|${item?.product?.item_code || ''}`
  };

}
