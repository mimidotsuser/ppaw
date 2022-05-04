import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CustomerContractFormComponent
} from './customer-contract-form/customer-contract-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';


@NgModule({
  declarations: [
    CustomerContractFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomerSearchModule,
    RouterModule,
  ],
  exports: [
    CustomerContractFormComponent
  ]
})
export class WidgetsModule {}
