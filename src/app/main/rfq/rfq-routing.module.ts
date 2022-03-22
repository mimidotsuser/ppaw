import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfqComponent } from './rfq.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: RfqComponent,
  children: [
    {path: '', pathMatch: 'exact', redirectTo: 'history'},
    {
      path: 'history',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {
        resource: Resources.rfq,
        action: Actions.view,
        title: 'All Request for Quotations', breadcrumb: 'Request for Quotation Forms'
      }
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {
        resource: Resources.rfq, action: Actions.create,
        title: 'New Request for Quotation', breadcrumb: 'Request for Quotation Form'
      }
    },
    {
      path: 'edit',
      loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
      data: {
        resource: Resources.rfq, action: Actions.edit,
        title: 'Edit Request for Quotation', breadcrumb: 'Edit RFQ Form'
      }

    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfqRoutingModule {}
