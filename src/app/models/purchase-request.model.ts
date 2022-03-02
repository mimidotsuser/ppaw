import { ProductModel } from './product.model';
import { UserModel } from './user.model';
import { MRFStage } from './m-r-f.model';

export interface PurchaseRequestLogModel {
  id: number;
  stage: MRFStage;
  remarks: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

export interface PurchaseRequestItemModel {
  id: string;
  product_id: string;
  qty_requested: number;
  qty_verified: number;
  qty_approved: number;
  product: ProductModel;
}

export interface PurchaseRequestModel {
  id: string;
  order_id: number; //human-readable incrementing number
  logs: PurchaseRequestLogModel[];
  items: PurchaseRequestItemModel[]
  created_by_id: string;
  created_by: UserModel
  created_at: string;
}
