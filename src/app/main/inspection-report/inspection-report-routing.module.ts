import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionReportComponent } from './inspection-report.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: InspectionReportComponent,
    children: [
      {path: 'history', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
      {
        path: 'purchased-products/:id/create',
        loadChildren: () => import('../inspection-report/purchased-products/create/create.module').then(m => m.CreateModule),
        data: {resource: Resources.inspection, action: Actions.create}
      },
      {
        path: 'purchased-products',
        loadChildren: () => import('../inspection-report/purchased-products/index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.inspection, action: Actions.view}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionReportRoutingModule {}
