import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequisitionComponent } from './purchase-requisition.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: PurchaseRequisitionComponent,
  children: [
    {
      path: 'history',
      loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      data: {
        resource: Resources.purchaseRequisition, action: Actions.view,
        title: 'All Purchase Requests',
        breadcrumb: 'Purchase Request Forms'
      }
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {
        resource: Resources.purchaseRequisition,
        action: Actions.create,
        title: 'Create Purchase Request',
        breadcrumb: 'Purchase Request Form'
      }
    },
    {
      path: 'check',
      loadChildren: () => import('./appraisal/appraisal.module').then(m => m.AppraisalModule),
      data: {
        resource: Resources.purchaseRequisition, action: Actions.verify,
        title: 'Check Purchase Requests',
        breadcrumb: 'Purchase Request Forms'
      }
    },
    {
      path: 'approve',
      loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
      data: {
        resource: Resources.purchaseRequisition, action: Actions.verify,
        title: 'Purchase Request Approval',
        breadcrumb: 'Purchase Request Forms'
      }
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequisitionRoutingModule {}
