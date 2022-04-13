import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
          resource: Resources.worksheet, action: Actions.view,
          title: 'Worksheet', breadcrumb: 'Worksheet Summary'
        }
      },
      {path: '', component: IndexComponent},
    ]),
    SharedModule,
    NgbDropdownModule,
  ]
})
export class HistoryModule {}
