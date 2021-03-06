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
        path: 'user-account',
        loadChildren: () => import('./user-account/user-account.module').then(m => m.UserAccountModule),
      },
      {
        path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        data: {title: 'All Users', breadcrumb: 'staff accounts'}
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),
        data: {title: 'All Customers', breadcrumb: 'All Customers'}
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
        loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule)
      },
      {
        path: 'goods-receipt-note',
        loadChildren: () => import('./goods-receipt-note/goods-receipt-note.module').then(m => m.GoodsReceiptNoteModule)
      },
      {
        path: 'inspection-note',
        loadChildren: () => import('./inspection-note/inspection-note.module').then(m => m.InspectionNoteModule)
      },
      {
        path: 'material-requisition',
        loadChildren: () => import('./material-requisition/material-requisition.module').then(m => m.MaterialRequisitionModule)
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
        loadChildren: () => import('./stock-balances/stock-balances.module').then(m => m.StockBalancesModule),
        data: {title: 'Stock Balances', breadcrumb: 'Stock Balances'}
      },
      {
        path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
        data: {title: 'All Roles', breadcrumb: 'User Roles'}
      },
      {
        path: 'vendors',
        loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule),
        data: {title: 'All Vendors', breadcrumb: 'All Vendors'}
      },
      {
        path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: {title: 'Dashboards'}
      },
      {
        path: 'product-items',
        loadChildren: () => import('./product-items/product-items.module').then(m => m.ProductItemsModule),
        data: {title: 'All Product Items', breadcrumb: 'Product Items'}
      },
      {
        path: 'customer-contracts',
        loadChildren: () => import('./customer-contracts/customer-contracts.module').then(m => m.CustomerContractsModule),
        data: {title: 'All Customer Contracts', breadcrumb: 'Customer Contracts'}
      },
      {
        path: 'standby-spare-checkin',
        loadChildren: () => import('./standby-spare-checkin/standby-spare-checkin.module').then(m => m.StandbySpareCheckinModule),
        data: {title: 'Standby Spare Checkin', breadcrumb: 'Standby Spare Checkin'}
      },
      {
        path: 'not-authorized',
        loadChildren: () => import('./not-authorized/not-authorized.module').then(m => m.NotAuthorizedModule),
        data: {title: 'Not Authorized', breadcrumb: 'Access Denied'}
      },
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {
        path: 'not-found',
        loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule),
        data: {title: 'Not Found', breadcrumb: 'Not Found'}
      },
      {
        path: '**',
        redirectTo: 'not-found'
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
