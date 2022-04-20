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
        data: {
          title: 'Material Requisition Checkout', breadcrumb: 'Checkout',
          resources: Resources.checkout, action: Actions.create
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}
