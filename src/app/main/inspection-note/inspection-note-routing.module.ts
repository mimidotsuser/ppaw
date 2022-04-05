import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionNoteComponent } from './inspection-note.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: InspectionNoteComponent,
    children: [
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
        data: {
          resource: Resources.inspectionNote, action: Actions.view,
          title: 'Inspection History', breadcrumb: 'Inspection Forms'
        }
      },
      {
        path: 'purchased-products',
        loadChildren: () => import('./purchased-products/purchased-products.module').then(m => m.PurchasedProductsModule),
        data: {
          resource: Resources.inspectionNote, action: Actions.view,
          title: 'Inspection Requests', breadcrumb: 'Inspection Requests'
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionNoteRoutingModule {}
