import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';

const routes: Routes = [{
  path: '', component: CheckinComponent, children: [
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/create/create.module').then(m => m.CreateModule)
    },
    {
      path: 'standby-reminder',
      loadChildren: () => import('./standby-products/standby-products.module').then(m => m.StandbyProductsModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinRoutingModule {}
