import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinApprovalComponent } from './checkin-approval.component';

const routes: Routes = [
  {
    path: '',
    component: CheckinApprovalComponent,
    children: [
      {
        path: 'grn-and-rga',
        loadChildren: () => import('./purchased-products/index/index.module').then(m => m.IndexModule)
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinApprovalRoutingModule {}
