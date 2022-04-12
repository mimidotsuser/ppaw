import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialRequisitionRoutingModule } from './material-requisition-routing.module';
import { MaterialRequisitionComponent } from './material-requisition.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    MaterialRequisitionComponent
  ],
  imports: [
    CommonModule,
    MaterialRequisitionRoutingModule,
    SharedModule
  ]
})
export class MaterialRequisitionModule {}
