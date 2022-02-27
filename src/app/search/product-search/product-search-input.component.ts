import { Component, Input, OnInit, } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'product-search-input[control],product-search-input[controlName]',
  templateUrl: './product-search-input.component.html',
  styleUrls: ['./product-search-input.component.scss']
})
export class ProductSearchInputComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';

  @Input() path = '/products/items'; //TODO replace with correct endpoint
  @Input() placeholder = 'Type to search';
  @Input() parent: ProductModel | null = null; //TODO use parent to filter
  @Input() customId?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item:  ProductModel) => string {
    return (item) => {
      return `${item.item_code} | ${item.mpn}`
    }
  }

  get queryParams(): { [ key: string ]: string } {
    if (this.parent) {
      return {search: '%s', parent_id: this.parent.id}
    } else {
      return {search: '%s'}
    }
  }

}
