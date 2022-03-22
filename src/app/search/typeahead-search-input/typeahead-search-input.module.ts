import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadSearchInputComponent } from './typeahead-search-input.component';


@NgModule({
  declarations: [
    TypeaheadSearchInputComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TypeaheadSearchInputComponent
  ]
})
export class TypeaheadSearchInputModule {}
