import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfqComponent } from './rfq.component';

const routes: Routes = [{
  path: '',
  component: RfqComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
    },
    {path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule)}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfqRoutingModule {}
