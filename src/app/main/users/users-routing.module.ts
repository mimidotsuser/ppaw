import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';

const routes: Routes = [{
  path: '', component: UsersComponent,
  children: [{
    path: '',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexModule)
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
