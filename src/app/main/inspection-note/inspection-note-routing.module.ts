import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionNoteComponent } from './inspection-note.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: InspectionNoteComponent,
    children: [
      {path: '', pathMatch: 'exact', redirectTo: 'history'},
      {
        path: 'history',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {
          resource: Resources.inspection, action: Actions.view,
          title: 'Inspection History', breadcrumb: 'Inspection Forms'
        }
      },
      {
        path: 'purchased-products',
        loadChildren: () => import('./purchased-products/purchased-products.module').then(m => m.PurchasedProductsModule),
        data: {title: 'Inspection Requests', breadcrumb: 'Pending Inspection Requests'}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionNoteRoutingModule {}
