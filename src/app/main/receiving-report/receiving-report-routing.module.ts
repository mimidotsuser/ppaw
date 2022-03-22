import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivingReportComponent } from './receiving-report.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: ReceivingReportComponent,
    children: [
      {path: '', pathMatch: 'exact', redirectTo: 'history'},
      {
        path: 'history',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {
          resource: Resources.receivingReport,
          action: Actions.view,
          title: 'All GRN & RGA',
          breadcrumb: 'GRN & RGA'
        }
      },
      {
        path: 'grn-and-rga',
        loadChildren: () => import('./grn-and-rga/grn-and-rga.module').then(m => m.GrnAndRgaModule),
        data: {title: 'GRN & RGA Approval', breadcrumb: 'GRN & RGA Pending Approval'}
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivingReportRoutingModule {}
