import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'purchase-requisition',
        loadChildren: () => import('./purchase-requisition/purchase-requisition.module').then(m => m.PurchaseRequisitionModule)
      },
      {
        path: 'request-for-quotation',
        loadChildren: () => import('./rfq/rfq.module').then(m => m.RfqModule)
      },
      {
        path: 'purchase-order',
        loadChildren: () => import('./lpo/lpo.module').then(m => m.LpoModule)
      },
      {
        path: 'checkin',
        loadChildren: () => import('./checkin/checkin.module').then(m => m.CheckinModule)
      },
      {
        path: 'inspection',
        loadChildren: () => import('./inspection/inspection.module').then(m => m.InspectionModule)
      },
      {
        path: 'checkin-approval',
        loadChildren: () => import('./checkin-approval/checkin-approval.module').then(m => m.CheckinApprovalModule)
      },
      {
        path: 'inventory-request',
        loadChildren: () => import('./checkout-request/checkout-request.module').then(m => m.CheckoutRequestModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
      },
      {
        path: 'worksheets',
        loadChildren: () => import('./worksheets/worksheets.module').then(m => m.WorksheetsModule)
      },
      {
        path: 'stock-ledger',
        loadChildren: () => import('./stock-ledger/stock-ledger.module').then(m => m.StockLedgerModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)},
      {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
      {path: '', redirectTo: 'home', pathMatch: 'exact'},
      {
        path: '**',
        loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule),
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
