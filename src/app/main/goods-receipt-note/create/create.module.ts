import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import {
  PurchaseOrderSearchModule
} from '../../../search/purchase-order-search/purchase-order-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    PurchaseOrderSearchModule
  ]
})
export class CreateModule {}
