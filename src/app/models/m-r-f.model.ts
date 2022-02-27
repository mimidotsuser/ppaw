import { UserModel } from './user.model';

export enum MRFPurpose {
  CLIENT_DEMO = 'CLIENT_DEMO',
  CLIENT_PURCHASE = 'CLIENT_PURCHASE',
  CLIENT_LEASE = 'CLIENT_LEASE',
  CLIENT_STANDBY = 'CLIENT_STANDBY',
  CLIENT_REPAIR = 'CLIENT_REPAIR',
}

enum MRFLevels {
  CREATE,
  VERIFY,
  APPROVE,
  CHECKOUT
}

export interface MRFProductModel {
  product_id: string;
  type: 'spare' | 'machine';
  purpose: MRFPurpose;
  client_id: string;
  qty_requested: number;
  qty_verified?: number;
  qty_approved?: number;
  qty_issued?: number;
  qty_worksheet_id?: string;
}

export interface MRFLog {
  id: string;
  level: MRFLevels;
  remarks: string;
  created_at?: string;
  created_by_id?: string;
  created_by?: UserModel;
}

/**
 * Material Requisition Form Model
 */
export interface MRFModel {
  id?: string;
  products: MRFProductModel[];
  logs: MRFLog[] | [];
  created_at?: string;
  created_by_id?: string;
  created_by?: UserModel;
}

