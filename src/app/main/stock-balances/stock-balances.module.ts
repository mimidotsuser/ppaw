import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockBalancesRoutingModule } from './stock-balances-routing.module';
import { StockBalancesComponent } from './stock-balances.component';


@NgModule({
  declarations: [
    StockBalancesComponent
  ],
  imports: [
    CommonModule,
    StockBalancesRoutingModule
  ],
})
export class StockBalancesModule {}
