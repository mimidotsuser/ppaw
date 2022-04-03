import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsReceiptNoteComponent } from './goods-receipt-note.component';

const routes: Routes = [
  {
    path: '', component: GoodsReceiptNoteComponent, children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'approval',
        loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule)
      },
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
      },

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceiptNoteRoutingModule {}
