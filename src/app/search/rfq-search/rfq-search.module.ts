import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputModule } from '../search-input/search-input.module';
import { RfqSearchComponent } from './rfq-search.component';


@NgModule({
  declarations: [
    RfqSearchComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule
  ],
  exports:[
    RfqSearchComponent
  ]
})
export class RfqSearchModule {}
