import { Component, Input, OnInit, } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { HttpService } from '../../core/services/http.service';
import { ProductCategoryModel } from '../../models/product-category.model';

@Component({
  selector: 'product-typeahead-input[control][category],product-typeahead-input[controlName][category]',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() category: ProductCategoryModel | null = null;
  @Input() placeholder = 'Type to search';
  @Input() parent: ProductModel | null = null;
  @Input() customId?: string;


  constructor(private httpService: HttpService) {
  }

  get path() {
    return this.category ?
      `${this.httpService.endpoint.productCategories}/${this.category.id}/products` :
      this.httpService.endpoint.products
      ;
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ProductModel) => string {
    return (item) => {
      return `${item.item_code} | ${item.manufacturer_part_number || item.local_description || item.description}`
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
