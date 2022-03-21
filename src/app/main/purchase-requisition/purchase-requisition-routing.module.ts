import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequisitionComponent } from './purchase-requisition.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: PurchaseRequisitionComponent,
  children: [
    {
      path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {resource: Resources.purchaseRequisition, action: Actions.view}
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.purchaseRequisition, action: Actions.create}
    },
    {
      path: 'check',
      loadChildren: () => import('./appraisal/appraisal.module').then(m => m.AppraisalModule),
      data: {resource: Resources.purchaseRequisition, action: Actions.verify}
    },
    {
      path: 'approve',
      loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
      data: {resource: Resources.purchaseRequisition, action: Actions.approve}
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequisitionRoutingModule {}
