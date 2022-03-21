import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
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
        path: 'request-for-quotations',
        loadChildren: () => import('./rfq/rfq.module').then(m => m.RfqModule)
      },
      {
        path: 'purchase-orders',
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
        path: 'checkout-requests',
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
        path: 'stock-balances',
        loadChildren: () => import('./stock-balances/stock-balances.module').then(m => m.StockBalancesModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)},
      {
        path: 'vendors',
        loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule)
      },
      {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
      {
        path: 'product-items',
        loadChildren: () => import('./product-items/product-items.module').then(m => m.ProductItemsModule)
      },
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
