import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfqComponent } from './rfq.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: RfqComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {resource: Resources.rfq, action: Actions.view}
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {resource: Resources.rfq, action: Actions.create}
    },
    {
      path: 'edit',
      loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
      data: {resource: Resources.rfq, action: Actions.edit}

    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfqRoutingModule {}
