import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateComponent } from './create.component';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';
import {ProductSearchModule} from "../../../search/product-search/product-search.module";


@NgModule({
  declarations: [
    CreateComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([{path: '', component: CreateComponent}]),
        SharedModule,
        NgSelectModule,
        CustomerSearchModule,
        ProductSearchModule
    ]
})
export class CreateModule {}
