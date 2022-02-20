import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpoRoutingModule } from './lpo-routing.module';
import { LpoComponent } from './lpo.component';


@NgModule({
  declarations: [
    LpoComponent
  ],
  imports: [
    CommonModule,
    LpoRoutingModule
  ]
})
export class LpoModule { }
