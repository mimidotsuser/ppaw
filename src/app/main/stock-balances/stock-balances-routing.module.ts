import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockBalancesComponent } from './stock-balances.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '',
    component: StockBalancesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
        data: {resource: Resources.stockBalance, action: Actions.view}
      },
     ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockBalancesRoutingModule {}
