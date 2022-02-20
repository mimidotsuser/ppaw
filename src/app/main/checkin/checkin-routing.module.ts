import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';

const routes: Routes = [{
  path: '', component: CheckinComponent, children: [
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/purchased-products.module').then(m => m.PurchasedProductsModule)
    },
    {
      path: 'leased-products',
      loadChildren: () => import('./leased-products/leased-products.module').then(m => m.LeasedProductsModule)
    },

    {
      path: 'demo-products',
      loadChildren: () => import('./demo-products/demo-products.module').then(m => m.DemoProductsModule)
    },
    {
      path: 'standby-products',
      loadChildren: () => import('./standby-products/standby-products.module').then(m => m.StandbyProductsModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinRoutingModule {}
