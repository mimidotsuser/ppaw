import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeaheadSearchInputModule } from '../typeahead-search-input/typeahead-search-input.module';
import { SearchWorksheetComponent } from './search-worksheet.component';


@NgModule({
  declarations: [
    SearchWorksheetComponent
  ],
  imports: [
    CommonModule,
    TypeaheadSearchInputModule
  ],
  exports: [
    SearchWorksheetComponent
  ]
})
export class SearchWorksheetModule {}
