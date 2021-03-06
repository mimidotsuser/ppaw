import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderSearchComponent } from './purchase-order-search.component';
import {
  TypeaheadSearchInputModule
} from '../typeahead-search-input/typeahead-search-input.module';


@NgModule({
  declarations: [
    PurchaseOrderSearchComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
    TypeaheadSearchInputModule,
  ],
  exports: [
    PurchaseOrderSearchComponent
  ]
})
export class PurchaseOrderSearchModule {}
