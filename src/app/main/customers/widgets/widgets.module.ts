import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';


@NgModule({
  declarations: [
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomerSearchModule
  ],
  exports: [
    CustomerFormComponent
  ]
})
export class WidgetsModule {}
