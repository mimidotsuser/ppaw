import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';

const routes: Routes = [{
  path: '', component: CheckinComponent, children: [
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/purchased-products.module').then(m => m.PurchasedProductsModule),
      data: {title: 'Products CheckIn'}
    },
    {
      path: 'standby-reminder',
      loadChildren: () => import('./standby-products/standby-products.module').then(m => m.StandbyProductsModule),
      data: {title: 'Standby Reminder CheckIn', breadcrumb: 'Products CheckIn'}
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinRoutingModule {}
