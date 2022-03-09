import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../../shared/shared.module';
import {
  PurchaseOrderSearchModule
} from '../../../../search/purchase-order-search/purchase-order-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    PurchaseOrderSearchModule,
    FontAwesomeModule,
  ]
})
export class CreateModule {}
