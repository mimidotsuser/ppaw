import { UserModel } from './user.model';
import { ProductModel } from './product.model';
import { CustomerModel } from './customer.model';

export enum MRFPurposeCode {
  DEMO = 'DEMO',
  SALE = 'SALE',
  LEASE = 'LEASE',
  STANDBY = 'STANDBY',
  REPAIR = 'REPAIR',
}

export enum MRFStage {
  REQUEST_CREATED = 'REQUEST_CREATED',
  VERIFIED_OKAYED = 'VERIFIED_OKAYED',
  VERIFIED_REJECTED = 'VERIFIED_REJECTED',
  APPROVAL_OKAYED = 'APPROVAL_OKAYED',
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
  PARTIAL_ISSUE = 'PARTIAL_ISSUE',
  ISSUED = 'ISSUED',
}

export interface MRFItemModel {
  id: number;
  material_requisition_id: number;
  product_id: number;
  purpose_code: MRFPurposeCode;
  purpose_title: string;
  customer_id: number;
  requested_qty: number;
  verified_qty?: number;
  approved_qty?: number;
  issued_qty?: number;
  worksheet_id?: number;
  product?: ProductModel;
  customer?: CustomerModel;
  cartButtonBusy?: boolean;
}

export interface MRFActivity {
  id: number;
  material_requisition_id: number;
  stage: MRFStage;
  outcome: MRFStage;
  remarks: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

/**
 * Material Requisition Form Model
 */
export interface MRFModel {
  id: number;
  sn: string;
  warehouse_id: number;
  items: MRFItemModel[];
  activities?: MRFActivity[];
  latest_activity?: MRFActivity;
  created_at?: string;
  created_by_id?: string;
  created_by?: UserModel;
}

