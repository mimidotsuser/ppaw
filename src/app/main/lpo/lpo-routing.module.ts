import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpoComponent } from './lpo.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: LpoComponent, children: [

      {
        path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.purchaseOrder, action: Actions.view}
      },
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
        data: {resource: Resources.purchaseOrder, action: Actions.create}
      },
      {
        path: 'edit',
        loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
        data: {resource: Resources.purchaseOrder, action: Actions.edit}
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpoRoutingModule {}
