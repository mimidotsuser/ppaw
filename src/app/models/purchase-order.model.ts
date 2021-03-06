import { UserModel } from './user.model';
import { UOMModel } from './u-o-m.model';
import { ProductModel } from './product.model';
import { CurrencyModel } from './currency.model';
import { VendorModel } from './vendor.model';
import { RFQModel } from './r-f-q.model';

export interface PurchaseOrderItemModel {
  id: number;
  purchase_order_id: number;
  rfq_item_id?: number;
  product_id: number;
  product?: ProductModel;
  qty: number;
  unit_of_measure_id: number;
  uom?: UOMModel;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  unit_price: number;
  delivered_qty?: number;
}

export interface PurchaseOrderModel {
  id: number;
  sn: string;
  rfq_id?: string;
  rfq?: RFQModel;
  doc_validity: string;
  items: PurchaseOrderItemModel[];
  vendor_id?: number;
  vendor?: VendorModel;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  currency_id: string;
  currency?: CurrencyModel;
}
