import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { Actions, Resources } from '../../../utils/permissions';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


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
          resource: Resources.materialRequisition, action: Actions.view,
          title: 'Material Requisition', breadcrumb: 'View Summary'
        }
      },
      {path: '', component: IndexComponent}
    ]),
    SharedModule,
    NgbDropdownModule,
    NgbNavModule,
  ]
})
export class HistoryModule {}
