import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { Actions, Resources } from '../../../utils/permissions';


@NgModule({
  declarations: [IndexComponent, CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IndexComponent,
        data: {resource: Resources.inspection, action: Actions.create}
      },
      {
        path: ':id/create',
        component: CreateComponent,
        data: {resource: Resources.inspection, action: Actions.create}
      }
    ]),
    SharedModule,
    FontAwesomeModule,
    NgbDropdownModule,
  ]
})
export class PurchasedProductsModule {}
