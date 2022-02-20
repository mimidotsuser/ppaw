import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpoComponent } from './lpo.component';

const routes: Routes = [
  {
    path: '', component: LpoComponent, children: [
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
      },
      {
        path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule)}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpoRoutingModule {}
