import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetsComponent } from './worksheets.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: WorksheetsComponent,
  children: [{
    path: '',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
    data: {resource: Resources.worksheet, action: Actions.view}
  },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.worksheet, action: Actions.create}
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetsRoutingModule {}
