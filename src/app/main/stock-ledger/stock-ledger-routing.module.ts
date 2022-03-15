import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockLedgerComponent } from './stock-ledger.component';

const routes: Routes = [
  {
    path: '',
    component: StockLedgerComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'adjustment',
        loadChildren: () => import('./inventory-adjustment/inventory-adjustment.module').then(m => m.InventoryAdjustmentModule)
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockLedgerRoutingModule {}
