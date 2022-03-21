import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivingReportComponent } from './receiving-report.component';

const routes: Routes = [
  {
    path: '', component: ReceivingReportComponent,
    children: [
      {
        path: 'history',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'grn-and-rga',
        loadChildren: () => import('./grn-and-rga/grn-and-rga.module').then(m => m.GrnAndRgaModule)
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivingReportRoutingModule {}
