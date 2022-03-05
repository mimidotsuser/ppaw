import { UserModel } from './user.model';
import { UOMModel } from './u-o-m.model';
import { VendorModel } from './vendor.model';
import { ProductModel } from './product.model';

export interface LPOVendors {
  id: number;
  vendor_id: string;
  created_at: string;
  created_by_id: string;
  vendor?: VendorModel;
  created_by?: UserModel;
}

export interface LPOItemModel {
  id: string;
  product_id: string;
  product?: ProductModel;
  qty: number;
  uom_id: string;
  uom?: UOMModel;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

export interface LPOModel {
  id: string;
  order_id: number;
  rfq_id?: string;
  closing_date: string;
  items: LPOItemModel[],
  vendors: LPOVendors[]
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}
