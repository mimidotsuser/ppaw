import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSearchInputComponent } from './customer-search-input.component';
import {
  TypeaheadSearchInputModule
} from '../typeahead-search-input/typeahead-search-input.module';


@NgModule({
  declarations: [
    CustomerSearchInputComponent,
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
    TypeaheadSearchInputModule,
  ],
  exports: [
    CustomerSearchInputComponent
  ]
})
export class CustomerSearchModule {}
