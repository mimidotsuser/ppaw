import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    children: [
      {path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
      {
        path: ':id/contracts/create',
        loadChildren: () => import('./contracts/create/create.module').then(m => m.CreateModule)
      },
      {
        path: ':id/contracts/edit',
        loadChildren: () => import('./contracts/edit/edit.module').then(m => m.EditModule)
      },
      {
        path: ':id/contracts',
        loadChildren: () => import('./contracts/index/index.module').then(m => m.IndexModule),
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
