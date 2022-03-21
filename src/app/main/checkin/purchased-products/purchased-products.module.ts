import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { Actions, Resources } from '../../../utils/permissions';
import { SharedModule } from '../../../shared/shared.module';
import {
  PurchaseOrderSearchModule
} from '../../../search/purchase-order-search/purchase-order-search.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CreateComponent,
      data: {resource: Resources.checkin, action: Actions.create}
    }]),
    SharedModule,
    PurchaseOrderSearchModule,
    FontAwesomeModule,
  ]
})
export class PurchasedProductsModule {}
