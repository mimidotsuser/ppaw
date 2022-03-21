import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: UsersComponent,
  children: [{
    path: '',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexModule),
    data: {resource: Resources.users, action: Actions.view}
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
