import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputModule } from '../search-input/search-input.module';
import { ProductSearchInputComponent } from './product-search-input.component';

@NgModule({
  declarations: [
    ProductSearchInputComponent,
  ],
  imports: [
    CommonModule,
    SearchInputModule,
  ],
  exports: [
    ProductSearchInputComponent,
  ]
})
export class ProductSearchModule {}
