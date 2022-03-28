import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';

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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}
