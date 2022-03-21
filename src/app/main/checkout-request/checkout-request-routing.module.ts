import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutRequestComponent } from './checkout-request.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: CheckoutRequestComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {resource: Resources.materialRequisition, action: Actions.view}
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.materialRequisition, action: Actions.create}
    },
    {
      path: 'verification',
      loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule),
      data: {resource: Resources.materialRequisition, action: Actions.verify}

    },
    {
      path: 'approval',
      loadChildren: () => import('./approve/approve.module').then(m => m.ApproveModule),
      data: {resource: Resources.materialRequisition, action: Actions.approve}

    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRequestRoutingModule {}
