import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialRequisitionComponent } from './material-requisition.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: MaterialRequisitionComponent,
  children: [
    {
      path: 'history',
      loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      data: {
        resource: Resources.materialRequisition, action: Actions.view,
        title: 'All Material Requisition Requests', breadcrumb: 'All Material Requisition Forms'
      }
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {
        resource: Resources.materialRequisition,
        action: Actions.create,
        title: 'New Material Requisition Request',
        breadcrumb: 'Material Requisition Form'
      }
    },
    {
      path: 'verification',
      loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule),
      data: {
        resource: Resources.materialRequisition,
        action: Actions.verify,
        title: 'Material Requisition Verification',
        breadcrumb: 'Material Requisition Forms',
      }

    },
    {
      path: 'approval',
      loadChildren: () => import('./approve/approve.module').then(m => m.ApproveModule),
      data: {
        resource: Resources.materialRequisition,
        action: Actions.approve,
        title: 'Material Requisition Approval',
        breadcrumb: 'Material Requisition Forms'
      }

    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRequisitionRoutingModule {}
