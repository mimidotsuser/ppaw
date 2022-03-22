import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from './product-search.component';
import {
  TypeaheadSearchInputModule
} from '../typeahead-search-input/typeahead-search-input.module';

@NgModule({
  declarations: [
    ProductSearchComponent,
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
    TypeaheadSearchInputModule,
  ],
  exports: [
    ProductSearchComponent,
  ]
})
export class ProductSearchModule {}
