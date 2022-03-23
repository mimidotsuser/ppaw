import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: RolesComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {resource: Resources.roles, action: Actions.view}
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.roles, action: Actions.create, title: 'Create Role'}
    },
    {
      path: 'edit/:id', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
      data: {resource: Resources.roles, action: Actions.edit, title: 'Edit Role'}

    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
