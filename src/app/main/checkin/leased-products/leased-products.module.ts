import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LeasedProductsComponent } from './leased-products.component';


@NgModule({
  declarations: [
    LeasedProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: LeasedProductsComponent}])
  ]
})
export class LeasedProductsModule {}
