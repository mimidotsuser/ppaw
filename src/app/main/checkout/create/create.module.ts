import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create.component';
import {
  ProductSerialSearchModule
} from '../../../search/product-serial-search/product-serial-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    FontAwesomeModule,
    ProductSerialSearchModule
  ]
})
export class CreateModule {}
