import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRequestRoutingModule } from './checkout-request-routing.module';
import { CheckoutRequestComponent } from './checkout-request.component';


@NgModule({
  declarations: [
    CheckoutRequestComponent
  ],
  imports: [
    CommonModule,
    CheckoutRequestRoutingModule
  ]
})
export class CheckoutRequestModule { }
