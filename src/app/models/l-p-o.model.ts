import { UserModel } from './user.model';
import { UOMModel } from './u-o-m.model';
import { VendorModel } from './vendor.model';
import { ProductModel } from './product.model';
import { CurrencyModel } from './currency.model';

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
  unit_price: number;
}

export interface LPOModel {
  id: string;
  order_id: number;
  rfq_id?: string;
  doc_date: string;
  items: LPOItemModel[],
  vendors: VendorModel[]
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  currency_id: string;
  currency?: CurrencyModel;
}
