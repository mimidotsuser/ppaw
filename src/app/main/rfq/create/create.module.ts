import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create.component';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import {
  PurchaseRequestSearchModule
} from '../../../search/purchase-request-search/purchase-request-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    ProductSearchModule,
    PurchaseRequestSearchModule
  ]
})
export class CreateModule {}
