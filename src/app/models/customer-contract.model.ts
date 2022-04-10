import { CustomerModel } from './customer.model';
import { UserModel } from './user.model';
import { ProductItemModel } from './product-item.model';

export interface ContractProductItemModel {
  id: number;
  product_item_id: number;
  customer_contract_id: number;
  created_at?: string;
  created_by_id?: string;
  created_by?: UserModel;
}

export interface CustomerContractModel {
  id: number;
  sn: string;
  category_code: string;
  category_title: string;
  customer_id: string;
  customer?: CustomerModel;
  productItems?: ProductItemModel[];
  start_date: string;
  expiry_date: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}
