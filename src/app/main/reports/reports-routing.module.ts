import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '', component: ReportsComponent, children: [
      {
        path: 'worksheets',
        loadChildren: () => import('./worksheets/worksheets.module').then(m => m.WorksheetsModule)
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
