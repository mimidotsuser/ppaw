import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetsComponent } from './worksheets.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: WorksheetsComponent,
  children: [
    {path: '', pathMatch: 'full', redirectTo: 'history'},
    {
      path: 'history',
      loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      data: {
        resource: Resources.worksheet, action: Actions.view,
        title: 'All Worksheets', breadcrumb: 'All Worksheets'
      }

    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {
        resource: Resources.worksheet, action: Actions.create,
        title: 'New Worksheet', breadcrumb: 'Worksheet Form'
      }
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetsRoutingModule {}
