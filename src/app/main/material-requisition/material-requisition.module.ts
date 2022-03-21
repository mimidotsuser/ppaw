import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialRequisitionRoutingModule } from './material-requisition-routing.module';
import { MaterialRequisitionComponent } from './material-requisition.component';


@NgModule({
  declarations: [
    MaterialRequisitionComponent
  ],
  imports: [
    CommonModule,
    MaterialRequisitionRoutingModule
  ]
})
export class MaterialRequisitionModule {}
