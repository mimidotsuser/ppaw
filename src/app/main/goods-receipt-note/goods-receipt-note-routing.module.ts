import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsReceiptNoteComponent } from './goods-receipt-note.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [
  {
    path: '', component: GoodsReceiptNoteComponent, children: [
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
        data: {
          resource: Resources.goodsReceiptNote, action: Actions.view,
          title: 'All GRN/RGA DOCS', breadcrumb: 'Goods Received Note Forms'
        }
      },
      {
        path: 'approval',
        loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
        data: {
          resource: Resources.goodsReceiptNote,
          action: Actions.view,
          title: 'GRN/RGA Approval Requests',
          breadcrumb: 'Goods Received Note Forms'
        }
      },
      {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
        data: {
          resource: Resources.goodsReceiptNote,
          action: Actions.create,
          title: 'Create Goods Receipt Note',
          breadcrumb: 'Goods Receipt Note Form'
        }
      },

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceiptNoteRoutingModule {}
