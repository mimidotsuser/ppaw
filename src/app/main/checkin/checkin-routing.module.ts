import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: CheckinComponent, children: [
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.checkin, action: Actions.create}
    },
    {
      path: 'standby-reminder',
      loadChildren: () => import('./standby-products/standby-products.module').then(m => m.StandbyProductsModule),
      data: {resource: Resources.checkin, action: Actions.create}
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinRoutingModule {}
