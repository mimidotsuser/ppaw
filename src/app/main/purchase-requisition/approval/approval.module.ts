import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApprovalComponent } from './approval.component';


@NgModule({
  declarations: [
    ApprovalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ApprovalComponent}])
  ]
})
export class ApprovalModule {}
