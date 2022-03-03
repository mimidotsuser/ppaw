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
    RouterModule.forChild([{
      path: '', component: AppraisalComponent, children: [
        {path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
        {
          path: ':id',
          loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
        }]
    }])
  ]
})
export class AppraisalModule {}
