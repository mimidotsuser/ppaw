import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create/create.component';
import { Actions, Resources } from '../../../utils/permissions';


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
        data: {
          resource: Resources.purchaseRequisition,
          action: Actions.verify,
          title: 'Check Purchase Request',
          breadcrumb: 'verify'
        }
      }
    ]),
    SharedModule,
  ]
})
export class AppraisalModule {}
