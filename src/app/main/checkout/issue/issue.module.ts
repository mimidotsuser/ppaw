import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create/create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ProductSerialSearchModule
} from '../../../search/product-serial-search/product-serial-search.module';
import { Actions, Resources } from '../../../utils/permissions';


@NgModule({
  declarations: [IndexComponent, CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: CreateComponent,
        data: {
          resource: Resources.checkout,
          action: Actions.create,
          title: 'Material Request :id Checkout'
        }
      },
      {
        path: '',
        component: IndexComponent,
        data: {
          resource: Resources.checkout, action: Actions.create,
          title: 'Material Requests Checkout'
        }
      }]),
    SharedModule,
    FontAwesomeModule,
    ProductSerialSearchModule
  ]
})
export class IssueModule {}
