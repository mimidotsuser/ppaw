import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachineFormComponent } from './machine-form/machine-form.component';
import { SpareFormComponent } from './spare-form/spare-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MachineFormComponent,
    SpareFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    MachineFormComponent,
    SpareFormComponent
  ]
})
export class ProductWidgetsModule {}
