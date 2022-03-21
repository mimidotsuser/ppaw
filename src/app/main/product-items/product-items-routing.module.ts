import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemsComponent } from './product-items.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: ProductItemsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.productItems, action: Actions.view}
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductItemsRoutingModule {}
