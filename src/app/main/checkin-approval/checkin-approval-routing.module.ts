import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinApprovalComponent } from './checkin-approval.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '',
    component: CheckinApprovalComponent,
    children: [
      {
        path: 'grn-and-rga/create',
        loadChildren: () => import('./purchased-products/create/create.module').then(m => m.CreateModule),
        data: {resource: Resources.inspection, action: Actions.create}
      },
      {
        path: 'grn-and-rga',
        loadChildren: () => import('./purchased-products/index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.inspection, action: Actions.view}
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinApprovalRoutingModule {}
