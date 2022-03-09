import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderSearchComponent } from './purchase-order-search.component';
import { SearchInputModule } from '../search-input/search-input.module';


@NgModule({
  declarations: [
    PurchaseOrderSearchComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule,
  ],
  exports: [
    PurchaseOrderSearchComponent
  ]
})
export class PurchaseOrderSearchModule {}
