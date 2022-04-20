import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemsComponent } from './product-items.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: ProductItemsComponent,
    children: [
      {
        path: ':id/activities',
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule),
        data: {resource: Resources.productItemActivity, action: Actions.view,
        title:'Product Item Activities',breadcrumb:'History logs'
        }
      },
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.productItems, action: Actions.view}
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductItemsRoutingModule {}
