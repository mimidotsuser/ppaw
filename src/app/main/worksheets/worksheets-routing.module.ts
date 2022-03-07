import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetsComponent } from './worksheets.component';

const routes: Routes = [{
  path: '', component: WorksheetsComponent,
  children: [{
    path: '',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
  },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetsRoutingModule {}
