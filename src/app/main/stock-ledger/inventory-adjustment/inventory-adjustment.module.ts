import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InventoryAdjustmentComponent } from './inventory-adjustment.component';


@NgModule({
  declarations: [
    InventoryAdjustmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: InventoryAdjustmentComponent}])
  ]
})
export class InventoryAdjustmentModule {}
