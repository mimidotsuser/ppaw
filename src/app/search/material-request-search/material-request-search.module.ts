import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialRequestSearchComponent } from './material-request-search.component';
import {
  TypeaheadSearchInputModule
} from '../typeahead-search-input/typeahead-search-input.module';


@NgModule({
  declarations: [
    MaterialRequestSearchComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule,
  ],
  exports: [
    MaterialRequestSearchComponent
  ]
})
export class MaterialRequestSearchModule {}
