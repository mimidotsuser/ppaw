import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRequestSearchComponent } from './purchase-request-search.component';
import { TypeaheadSearchInputModule } from '../typeahead-search-input/typeahead-search-input.module';


@NgModule({
  declarations: [
    PurchaseRequestSearchComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
    TypeaheadSearchInputModule
  ],
  exports: [
    PurchaseRequestSearchComponent
  ]
})
export class PurchaseRequestSearchModule {}
