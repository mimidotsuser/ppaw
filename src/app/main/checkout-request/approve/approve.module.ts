import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApproveComponent } from './approve.component';


@NgModule({
  declarations: [
    ApproveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ApproveComponent}])
  ]
})
export class ApproveModule {}
