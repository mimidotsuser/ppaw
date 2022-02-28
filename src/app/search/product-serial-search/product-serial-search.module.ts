import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputModule } from '../search-input/search-input.module';
import { ProductSerialSearchComponent } from './product-serial-search.component';


@NgModule({
  declarations: [
    ProductSerialSearchComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule
  ],
  exports: [ProductSerialSearchComponent]
})
export class ProductSerialSearchModule {}
