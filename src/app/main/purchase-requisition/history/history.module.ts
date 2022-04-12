import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../../shared/shared.module';
import { Actions, Resources } from '../../../utils/permissions';


@NgModule({
  declarations: [
    IndexComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id', component: ShowComponent,
        data: {
          resource: Resources.purchaseRequisition, action: Actions.view,
          title: 'Purchase Request Summary',
          breadcrumb: 'View'
        }
      },
      {path: '', component: IndexComponent},
    ]),
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
  ]
})
export class HistoryModule {}
