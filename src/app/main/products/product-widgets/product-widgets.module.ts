import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineFormComponent } from './machine-form/machine-form.component';
import { SpareFormComponent } from './spare-form/spare-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';


@NgModule({
  declarations: [
    MachineFormComponent,
    SpareFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductSearchModule
  ],
  exports: [
    MachineFormComponent,
    SpareFormComponent
  ]
})
export class ProductWidgetsModule {}
