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
    RouterModule.forChild([
      {
        path: '', component: ApprovalComponent,
        children: [
          {path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
          {
            path: ':id',
            loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
          }
        ]
      }])
  ]
})
export class ApprovalModule {}
