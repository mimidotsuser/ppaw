import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodsReceiptNoteRoutingModule } from './goods-receipt-note-routing.module';
import { GoodsReceiptNoteComponent } from './goods-receipt-note.component';


@NgModule({
  declarations: [
    GoodsReceiptNoteComponent
  ],
  imports: [
    CommonModule,
    GoodsReceiptNoteRoutingModule
  ]
})
export class GoodsReceiptNoteModule { }
