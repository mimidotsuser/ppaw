import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineFormComponent } from './machine-form/machine-form.component';
import { SpareFormComponent } from './spare-form/spare-form.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    MachineFormComponent,
    SpareFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    MachineFormComponent,
    SpareFormComponent
  ]
})
export class ProductWidgetsModule {}
