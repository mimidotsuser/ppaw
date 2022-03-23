import { Component, Input, OnInit, } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'product-typeahead-input[control],product-typeahead-input[controlName]',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';

  @Input() placeholder = 'Type to search';
  @Input() parent: ProductModel | null = null; //TODO use parent to filter
  @Input() customId?: string;


  constructor(private httpService: HttpService) {
  }

  get path() {
    return this.parent
      ? `${this.httpService.endpoint.productCategories}/2`
      : `${this.httpService.endpoint.productCategories}/1`
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ProductModel) => string {
    return (item) => {
      return `${item.item_code} | ${item.manufacturer_part_number}`
    }
  }

  get queryParams(): { [ key: string ]: string } {
    if (this.parent) {
      return {search: '%s', parent_id: this.parent.id.toString()}
    } else {
      return {search: '%s'}
    }
  }

}
