import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { Actions, Resources } from '../../../utils/permissions';


@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: IndexComponent,
        data: {resource: Resources.receivingReport, action: Actions.approve}
      },
      {
        path: ':id/create', component: CreateComponent,
        data: {
          resource: Resources.receivingReport,
          action: Actions.approve,
          title: 'GRN & RGA Approval',
          breadcrumb: 'Approval Form'
        }
      }
    ]),
  ]
})
export class GrnAndRgaModule {}
