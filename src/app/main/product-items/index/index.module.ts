import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import {
  PurchaseOrderSearchModule
} from '../../../search/purchase-order-search/purchase-order-search.module';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    SharedModule,
    NgbDropdownModule,
    ProductSearchModule,
    PurchaseOrderSearchModule,
    CustomerSearchModule
  ]
})
export class IndexModule {}
