import { UserModel } from './user.model';
import { ProductModel } from './product.model';
import { ClientModel } from './client.model';

export enum MRFPurpose {
  CLIENT_DEMO = 'CLIENT_DEMO',
  CLIENT_PURCHASE = 'CLIENT_PURCHASE',
  CLIENT_LEASE = 'CLIENT_LEASE',
  CLIENT_STANDBY = 'CLIENT_STANDBY',
  CLIENT_REPAIR = 'CLIENT_REPAIR',
}

export enum MRFStage {
  CREATE,
  VERIFY,
  APPROVE,
  CHECKOUT,
  ISSUED
}

export interface MRFOrderItemsModel {
  product_id: string;
  type: 'spare' | 'machine';
  purpose: MRFPurpose;
  client_id: string;
  qty_requested: number;
  qty_verified?: number;
  qty_approved?: number;
  qty_issued?: number;
  worksheet_id?: string;
  product?: ProductModel;
  client?: ClientModel;
}

export interface MRFLog {
  id: number;
  stage: MRFStage;
  remarks: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

/**
 * Material Requisition Form Model
 */
export interface MRFModel {
  id?: string;
  order_id: number;
  order_items: MRFOrderItemsModel[];
  logs: MRFLog[];
  created_at?: string;
  created_by_id?: string;
  created_by?: UserModel;
}

