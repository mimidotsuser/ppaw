import { PurchaseOrderItemModel, PurchaseOrderModel } from './purchase-order.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';
import { WarehouseModel } from './warehouse.model';
import { InspectionModel } from './inspection.model';

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
  purchase_order_item?: PurchaseOrderItemModel
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
  sn: string;
  reference: string;
  purchase_order_id: number;
  purchase_order?: PurchaseOrderModel;
  warehouse_id: number;
  warehouse?: WarehouseModel;
  items: GoodsReceiptNoteItemModel[],
  activities?: GoodsReceiptNoteActivityModel[],
  latest_activity?: GoodsReceiptNoteActivityModel,
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
  has_rejected_items?: boolean;
  inspection_note?: InspectionModel
}
