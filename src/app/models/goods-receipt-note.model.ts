import { PurchaseOrderModel } from './purchase-order.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';
import { WarehouseModel } from './warehouse.model';

export enum GRNReceiptNoteStage {
  REQUEST_CREATED = 'REQUEST_CREATED',
  INSPECTION_DONE = 'INSPECTION_DONE',
  APPROVAL_OKAYED = 'APPROVAL_OKAYED',
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
}

export interface GoodsReceiptNoteItemModel {
  id: number;
  goods_receipt_note_id: number;
  po_item_id?: number;
  product_id: number;
  product?: ProductModel;
  delivered_qty: number;
  rejected_qty?: number;
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}

export interface GoodsReceiptNoteActivityModel {
  id: number;
  goods_receipt_note_id: number;
  stage: keyof typeof GRNReceiptNoteStage
  outcome: string;
  remarks: string;
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}

/**
 * Purchased product check-in model
 */
export interface GoodsReceiptNoteModel {
  id: number;
  reference: string;
  purchase_order_id: number;
  po?: PurchaseOrderModel;
  warehouse_id: number;
  warehouse?: WarehouseModel;
  items: GoodsReceiptNoteItemModel[],
  activities?: GoodsReceiptNoteActivityModel[],
  latestActivity?: GoodsReceiptNoteActivityModel,
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}
