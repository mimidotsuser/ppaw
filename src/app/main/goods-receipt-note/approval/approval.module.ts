import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalComponent } from './approval.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ApprovalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: ApprovalComponent, children: [
        {
          path: ':id/create',
          loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
        },
        {path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)}
      ]
    }])
  ]
})
export class ApprovalModule {}
