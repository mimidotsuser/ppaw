import { ProductModel } from './product.model';
import { UserModel } from './user.model';
import { WarehouseModel } from './warehouse.model';

export enum PRStage {
  REQUEST_CREATED = 'REQUEST_CREATED',
  VERIFIED_OKAYED = 'VERIFIED_OKAYED',
  VERIFIED_REJECTED = 'VERIFIED_REJECTED',
  APPROVAL_OKAYED = 'APPROVAL_OKAYED',
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
  PARTIAL_ISSUE = 'PARTIAL_ISSUE',
  ISSUED = 'ISSUED',
}


export interface PurchaseRequestActivityModel {
  id: number;
  purchase_request_id: number;
  stage: PRStage;
  outcome: string;
  remarks?: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

export interface PurchaseRequestItemModel {
  id: number;
  purchase_request_id: number;
  product_id: number;
  product: ProductModel;
  requested_qty: number;
  verified_qty?: number;
  approved_qty?: number;
}

export interface PurchaseRequestModel {
  id: number;
  sn: string;
  warehouse_id: number;
  warehouse?: WarehouseModel;
  activities: PurchaseRequestActivityModel[];
  latest_activity?: PurchaseRequestActivityModel;
  items: PurchaseRequestItemModel[]
  created_by_id: string;
  created_by: UserModel
  created_at: string;
}
