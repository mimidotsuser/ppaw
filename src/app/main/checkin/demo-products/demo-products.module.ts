import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DemoProductsComponent } from './demo-products.component';


@NgModule({
  declarations: [
    DemoProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: DemoProductsComponent}])
  ]
})
export class DemoProductsModule {}
