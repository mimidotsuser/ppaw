import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivingReportRoutingModule } from './receiving-report-routing.module';
import { ReceivingReportComponent } from './receiving-report.component';


@NgModule({
  declarations: [
    ReceivingReportComponent
  ],
  imports: [
    CommonModule,
    ReceivingReportRoutingModule
  ]
})
export class ReceivingReportModule { }
