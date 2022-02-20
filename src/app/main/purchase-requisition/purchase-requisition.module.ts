import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRequisitionRoutingModule } from './purchase-requisition-routing.module';
import { PurchaseRequisitionComponent } from './purchase-requisition.component';


@NgModule({
  declarations: [
    PurchaseRequisitionComponent
  ],
  imports: [
    CommonModule,
    PurchaseRequisitionRoutingModule
  ]
})
export class PurchaseRequisitionModule { }
