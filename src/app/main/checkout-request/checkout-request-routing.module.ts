import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutRequestComponent } from './checkout-request.component';

const routes: Routes = [{
  path: '',
  component: CheckoutRequestComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
    },
    {
      path: 'verification',
      loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule)
    },
    {
      path: 'approval',
      loadChildren: () => import('./approve/approve.module').then(m => m.ApproveModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRequestRoutingModule {}
