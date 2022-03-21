import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
        data: {resource: Resources.checkout, action: Actions.create}
      },
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.checkout, action: Actions.view}
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}
