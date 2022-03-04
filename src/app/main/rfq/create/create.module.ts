import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/shared.module';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import {
  PurchaseRequestSearchModule
} from '../../../search/purchase-request-search/purchase-request-search.module';
import { VendorWidgetsModule } from '../../vendors/vendor-widgets/vendor-widgets.module';
import { CreateComponent } from './create.component';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    ProductSearchModule,
    PurchaseRequestSearchModule,
    NgSelectModule,
    VendorWidgetsModule,
  ]
})
export class CreateModule {}
