import { UserModel } from './user.model';
import { ProductBalanceModel } from './product-balance.model';

export interface ProductModel {
  id: number;
  parent_id?: string;
  parent?: ProductModel;
  variant_of_id?: string;
  variant_of?: ProductModel;
  item_code: string;
  manufacturer_part_number?: string;
  description: string;
  local_description?: string;
  chinese_description?: string;
  economic_order_qty: number;
  min_level: number;
  reorder_level: number;
  max_level: number;
  created_by_id: string;
  created_at: string;
  created_by?: UserModel;
  balance?: ProductBalanceModel
  edit?: boolean;
}
