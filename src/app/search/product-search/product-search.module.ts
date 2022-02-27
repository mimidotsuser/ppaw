import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchInputComponent } from './product-search-input/product-search-input.component';
import { SearchInputModule } from '../search-input/search-input.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductSearchInputComponent,
  ],
  imports: [
    CommonModule,
    SearchInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    ProductSearchInputComponent,
  ]
})
export class ProductSearchModule {}
