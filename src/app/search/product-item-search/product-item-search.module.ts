import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemSearchComponent } from './product-item-search.component';
import {
  TypeaheadSearchInputModule
} from '../typeahead-search-input/typeahead-search-input.module';


@NgModule({
  declarations: [
    ProductItemSearchComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
    TypeaheadSearchInputModule
  ],
  exports: [ProductItemSearchComponent]
})
export class ProductItemSearchModule {}
