import { UserModel } from './user.model';
import { UOMModel } from './u-o-m.model';
import { VendorModel } from './vendor.model';
import { ProductModel } from './product.model';

export interface RFQVendors {
  id: number;
  vendor_id: string;
  vendor: VendorModel;
  created_at: string;
  created_by_id: string;
}

export interface RFQItemModel {
  id: string;
  product_id: string;
  product?: ProductModel;
  qty: number;
  uom_id: UOMModel;
  created_at: string;
  created_by_id: string;
}

export interface RFQModel {
  id: string;
  order_id: number;
  purchase_request_id?: string;
  closing_date: string;
  items: RFQItemModel[],
  vendors: RFQVendors[]
  created_at: string;
  created_by_id: string;
  created_by: UserModel;
}
