import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PurchasedProductsComponent } from './purchased-products.component';


@NgModule({
  declarations: [
    PurchasedProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: PurchasedProductsComponent}])
  ]
})
export class PurchasedProductsModule {}
