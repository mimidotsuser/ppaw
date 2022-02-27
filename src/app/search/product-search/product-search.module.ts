import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../shared/shared.module';
import { ProductSearchInputComponent } from './product-search-input/product-search-input.component';

@NgModule({
  declarations: [
    ProductSearchInputComponent,
  ],
  imports: [
    CommonModule,
    NgbTypeaheadModule,
    SharedModule,
    FontAwesomeModule,
  ],
  exports: [
    ProductSearchInputComponent,
  ]
})
export class ProductSearchModule {}
