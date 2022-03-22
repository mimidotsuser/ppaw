import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    children: [
      {
        path: 'issue-requests',
        loadChildren: () => import('./issue/issue.module').then(m => m.IssueModule),
        data: {title: 'Material Requisition Checkout', breadcrumb: 'Checkout'}
      },
      {
        path: 'history',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.checkout, action: Actions.view, title: 'Checkout History'}
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}
