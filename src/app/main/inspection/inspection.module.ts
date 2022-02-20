import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionComponent } from './inspection.component';


@NgModule({
  declarations: [
    InspectionComponent
  ],
  imports: [
    CommonModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
