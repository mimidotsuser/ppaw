import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchInputComponent } from './search-input.component';


@NgModule({
  declarations: [
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SearchInputComponent
  ]
})
export class SearchInputModule {}
