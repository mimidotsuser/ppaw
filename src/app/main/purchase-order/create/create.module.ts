import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { VendorService } from '../../vendors/services/vendor.service';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import { WidgetsModule as VendorWidgetsModule } from '../../vendors/widgets/widgets.module';
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
    NgbDropdownModule,
  ],
  providers: [VendorService]
})
export class CreateModule {}
