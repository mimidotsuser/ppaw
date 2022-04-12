import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
          resource: Resources.rfq, action: Actions.view,
          title: 'Request for Quotation (RFQ)', breadcrumb: 'RFQ Summary'
        }
      },
      {path: '', component: IndexComponent},
    ]),
    SharedModule,
    NgbDropdownModule,
  ]
})
export class HistoryModule {}
