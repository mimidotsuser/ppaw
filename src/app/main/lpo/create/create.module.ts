import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/shared.module';
import { VendorService } from '../../vendors/vendor-widgets/services/vendor.service';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import { VendorWidgetsModule } from '../../vendors/vendor-widgets/vendor-widgets.module';
import { CreateComponent } from './create.component';
import { RfqSearchModule } from '../../../search/rfq-search/rfq-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    NgSelectModule,
    ProductSearchModule,
    VendorWidgetsModule,
    RfqSearchModule,

  ],
  providers: [VendorService]
})
export class CreateModule {}
