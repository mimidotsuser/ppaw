import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { Actions, Resources } from '../../../utils/permissions';
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
        data: {resource: Resources.purchaseRequisition, action: Actions.approve}
      },
      {
        path: '',
        component: CreateComponent,
        data: {resource: Resources.purchaseRequisition, action: Actions.approve}
      }
    ]),
    SharedModule,
  ]
})
export class ApprovalModule {}
