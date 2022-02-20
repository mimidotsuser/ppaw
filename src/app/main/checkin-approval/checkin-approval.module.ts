import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinApprovalRoutingModule } from './checkin-approval-routing.module';
import { CheckinApprovalComponent } from './checkin-approval.component';


@NgModule({
  declarations: [
    CheckinApprovalComponent
  ],
  imports: [
    CommonModule,
    CheckinApprovalRoutingModule
  ]
})
export class CheckinApprovalModule { }
