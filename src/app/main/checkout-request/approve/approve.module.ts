import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ApproveComponent } from './approve.component';


@NgModule({
  declarations: [
    ApproveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ApproveComponent}]),
    SharedModule
  ]
})
export class ApproveModule {}
