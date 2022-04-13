import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { IndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Actions, Resources } from '../../../utils/permissions';


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
          resource: Resources.contracts, action: Actions.view,
          title: 'Customer Contract Summary', breadcrumb: 'View Summary'
        }
      },
      {path: '', component: IndexComponent}
    ]),
    SharedModule,
    NgbDropdownModule
  ]
})
export class HistoryModule {}
