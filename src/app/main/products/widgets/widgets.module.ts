import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';


@NgModule({
  declarations: [
    ProductFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductSearchModule
  ],
  exports: [
    ProductFormComponent
  ]
})
export class WidgetsModule {}
