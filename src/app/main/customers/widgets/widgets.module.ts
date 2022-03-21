import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { ClientSearchModule } from '../../../search/client-search/client-search.module';


@NgModule({
  declarations: [
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientSearchModule
  ],
  exports: [
    CustomerFormComponent
  ]
})
export class WidgetsModule {}
