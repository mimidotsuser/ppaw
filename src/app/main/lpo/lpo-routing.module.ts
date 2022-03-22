import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpoComponent } from './lpo.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: LpoComponent, children: [
      {path: '', pathMatch: 'exact', redirectTo: 'history'},
      {
        path: 'history',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {
          resource: Resources.purchaseOrder, action: Actions.view,
          title: 'All Purchase Orders', breadcrumb: 'Purchase Order Forms'
        }
      },
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
        data: {
          resource: Resources.purchaseOrder, action: Actions.create,
          title: 'Create Purchase Order', breadcrumb: 'Purchase Order Form'
        }
      },
      {
        path: 'edit',
        loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
        data: {
          resource: Resources.purchaseOrder, action: Actions.edit,
          title: 'Edit Purchase Order', breadcrumb: 'Purchase Order Form'
        }
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpoRoutingModule {}
