import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VendorFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    VendorFormComponent
  ]
})
export class VendorWidgetsModule {}
