import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeaheadSearchInputModule } from '../typeahead-search-input/typeahead-search-input.module';
import { RfqSearchComponent } from './rfq-search.component';


@NgModule({
  declarations: [
    RfqSearchComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule
  ],
  exports:[
    RfqSearchComponent
  ]
})
export class RfqSearchModule {}
