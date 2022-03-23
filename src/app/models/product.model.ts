import { UserModel } from './user.model';

export interface ProductModel {
  id: number;
  parent_id?: string;
  parent?: ProductModel;
  item_code: string;
  mpn: string;
  description: string;
  local_description?: string;
  chinese_description?: string;
  eoq: number;
  minl: number;
  rol: number;
  maxl: number;
  created_by_id: string;
  created_by?: UserModel;
  edit?: boolean;
  physical_balance?: number
}
