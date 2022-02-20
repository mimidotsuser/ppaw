import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequisitionComponent } from './purchase-requisition.component';

const routes: Routes = [{
  path: '', component: PurchaseRequisitionComponent,
  children: [
    {
      path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
    },
    {
      path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
    },
    {
      path: 'check',
      loadChildren: () => import('./appraisal/appraisal.module').then(m => m.AppraisalModule)
    },
    {
      path: 'approve',
      loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRequisitionRoutingModule {}
