import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorFormComponent } from './vendor-form/vendor-form.component';


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
export class WidgetsModule {}
