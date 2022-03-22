import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: ':id',
        component: CreateComponent,
        data: {title: 'Purchase Request Approval', breadcrumb: 'Approve'}
      }
    ]),
    SharedModule,
  ]
})
export class ApprovalModule {}
