import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputModule } from '../search-input/search-input.module';
import { SearchWorksheetComponent } from './search-worksheet.component';


@NgModule({
  declarations: [
    SearchWorksheetComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule
  ],
  exports: [
    SearchWorksheetComponent
  ]
})
export class SearchWorksheetModule {}
