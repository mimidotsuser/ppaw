import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductItemsRoutingModule } from './product-items-routing.module';
import { ProductItemsComponent } from './product-items.component';


@NgModule({
  declarations: [
    ProductItemsComponent
  ],
  imports: [
    CommonModule,
    ProductItemsRoutingModule
  ]
})
export class ProductItemsModule { }
