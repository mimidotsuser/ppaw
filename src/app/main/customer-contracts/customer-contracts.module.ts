import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerContractsRoutingModule } from './customer-contracts-routing.module';
import { CustomerContractsComponent } from './customer-contracts.component';


@NgModule({
  declarations: [
    CustomerContractsComponent
  ],
  imports: [
    CommonModule,
    CustomerContractsRoutingModule
  ]
})
export class CustomerContractsModule { }
