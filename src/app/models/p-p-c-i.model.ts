import { LPOModel } from './l-p-o.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';

export enum CheckInStagesModel {
  RECEIVED = 'Items Received',
  INSPECTION = 'Items Inspected',
  APPROVAL = 'GRN/RJA Approved'
}

export interface PPCItemModel {
  id: string;
  product_id: string;
  product?: ProductModel;
  qty: number;
  created_by_id: string;
  created_by?: UserModel;
  po_item_id: string;
  created_at: string;
}

export interface PPCLogModel {
  id: string;
  stage: keyof typeof CheckInStagesModel
  remarks: string;
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}

/**
 * Purchased product check-in model
 */
export interface PPCIModel {
  id: string;
  po_id: string;
  po?: LPOModel;
  reference_no: string; //D Note/
  created_by_id: string;
  created_by?: UserModel;
  items: PPCItemModel[],
  logs?: PPCLogModel[],
}
