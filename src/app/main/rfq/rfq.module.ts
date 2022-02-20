import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfqRoutingModule } from './rfq-routing.module';
import { RfqComponent } from './rfq.component';


@NgModule({
  declarations: [
    RfqComponent
  ],
  imports: [
    CommonModule,
    RfqRoutingModule
  ]
})
export class RfqModule { }
