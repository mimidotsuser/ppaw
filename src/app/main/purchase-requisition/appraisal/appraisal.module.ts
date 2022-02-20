import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppraisalComponent } from './appraisal.component';


@NgModule({
  declarations: [
    AppraisalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AppraisalComponent}])
  ]
})
export class AppraisalModule {}
