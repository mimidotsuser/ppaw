import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockLedgerRoutingModule } from './stock-ledger-routing.module';
import { StockLedgerComponent } from './stock-ledger.component';


@NgModule({
  declarations: [
    StockLedgerComponent
  ],
  imports: [
    CommonModule,
    StockLedgerRoutingModule
  ]
})
export class StockLedgerModule { }
