import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StandbyProductsComponent } from './standby-products.component';


@NgModule({
  declarations: [
    StandbyProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: StandbyProductsComponent}])
  ]
})
export class StandbyProductsModule {}
