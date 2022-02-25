import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

const routes: Routes = [{
  path: '',
  component: ProductsComponent,
  children: [
    {
      path: 'spares',
      loadChildren: () => import('./spares/spares.module').then((m) => m.SparesModule)
    }, {
      path: 'machines',
      loadChildren: () => import('./machines/machines.module').then((m) => m.MachinesModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
