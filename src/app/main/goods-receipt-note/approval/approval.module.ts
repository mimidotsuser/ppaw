import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalComponent } from './approval.component';
import { RouterModule } from '@angular/router';
import { Actions, Resources } from '../../../utils/permissions';


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
          loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
          data: {
            resource:Resources.goodsReceiptNote,
            action: Actions.approve,
            title: 'GRN/RGA Approval Request',
            breadcrumb: 'Approve'
          }
        },
        {path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)}
      ]
    }])
  ]
})
export class ApprovalModule {}
