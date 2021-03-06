import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { Actions, Resources } from '../../../utils/permissions';
import { SharedModule } from '../../../shared/shared.module';


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
          resource: Resources.goodsReceiptNote, action: Actions.view,
          title: 'GRN/RGA DOC', breadcrumb: 'View'
        }
      },
      {path: '', component: IndexComponent},
    ]),
    SharedModule,
    NgbDropdownModule,
  ]
})
export class HistoryModule {}
