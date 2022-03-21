import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';

const routes: Routes = [{
  path: '', component: CheckinComponent, children: [
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/purchased-products.module').then(m => m.PurchasedProductsModule),
    },
    {
      path: 'standby-reminder',
      loadChildren: () => import('./standby-products/standby-products.module').then(m => m.StandbyProductsModule),
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinRoutingModule {}
