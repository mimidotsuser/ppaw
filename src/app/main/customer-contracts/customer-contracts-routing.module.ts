import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerContractsComponent } from './customer-contracts.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: CustomerContractsComponent,
    children: [
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
        data: {
          resource: Resources.contracts, action: Actions.create,
          title: 'Create Contract', breadcrumb: 'Contract Form'
        }
      },
      {
        path: 'edit/:id', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
        data: {
          resource: Resources.contracts, action: Actions.edit,
          title: 'Edit Contract', breadcrumb: 'Contract Form'
        }
      },
      {path: '', pathMatch: 'full', redirectTo: 'history'},
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractsRoutingModule {}
