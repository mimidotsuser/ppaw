import { UserModel } from './user.model';
import { UOMModel } from './u-o-m.model';
import { VendorModel } from './vendor.model';
import { ProductModel } from './product.model';
import { PurchaseOrderModel } from './purchase-order.model';


export interface RFQItemModel {
  id: number;
  request_for_quotation_id: number;
  purchase_request_item_id?: number
  product_id: number;
  product?: ProductModel;
  qty: number;
  unit_of_measure_id: string;
  uom?: UOMModel;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}

export interface RFQModel {
  id: number;
  sn: string;
  purchase_request_id?: number;
  closing_date: string;
  items: RFQItemModel[],
  vendors?: VendorModel[]
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  purchase_order?: PurchaseOrderModel
}
