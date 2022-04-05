import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index/index.component';
import { Actions, Resources } from '../../../utils/permissions';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    ShowComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id', component: ShowComponent,
        data: {
          title: 'Inspection History', breadcrumb: 'view',
          resource: Resources.inspectionNote, action: Actions.view
        }
      },
      {
        path: '', component: IndexComponent,
        data: {resource: Resources.inspectionNote, action: Actions.view}
      }
    ]),
    NgbDropdownModule,
    SharedModule
  ]
})
export class HistoryModule {}
