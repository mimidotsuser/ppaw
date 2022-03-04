import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRequestSearchComponent } from './purchase-request-search.component';
import { SearchInputModule } from '../search-input/search-input.module';



@NgModule({
  declarations: [
    PurchaseRequestSearchComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule
  ],
  exports:[
    PurchaseRequestSearchComponent
  ]
})
export class PurchaseRequestSearchModule { }
