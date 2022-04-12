import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '',
  component: ProductsComponent,
  children: [
    {path: '', pathMatch: 'full', redirectTo: 'machines'},
    {
      path: 'spares',
      loadChildren: () => import('./spares/spares.module').then((m) => m.SparesModule),
      data: {
        resource: Resources.products, action: Actions.view,
        title: 'All Spare Items', breadcrumb: 'Products'
      }
    },
    {
      path: 'machines',
      loadChildren: () => import('./machines/machines.module').then((m) => m.MachinesModule),
      data: {
        resource: Resources.products, action: Actions.view,
        title: 'All Machine Items', breadcrumb: 'Products'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
