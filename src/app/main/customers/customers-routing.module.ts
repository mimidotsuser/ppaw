import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.customers, action: Actions.view}
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {}
