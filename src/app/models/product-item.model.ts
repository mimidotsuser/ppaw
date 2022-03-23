import { ProductModel } from './product.model';
import { UserModel } from './user.model';
import { CustomerModel } from './customer.model';
import { CustomerContractModel } from './customer-contract.model';
import { ActivityDescriptionModel } from './activity-description.model';

export enum ProductItemLogCategory {
  WORKSHEET = 'Worksheet',
  CHECKIN = 'Item checkin',
  CHECKOUT = 'Item Checkout',
  TRANSFER = 'Item Transfer'
}

export interface ProductItemLogModel {
  id: string;
  category_code: keyof typeof ProductItemLogCategory;
  category: ProductItemLogCategory;
  client_id: string;
  client?: CustomerModel;
  contract_id: string;
  contract?: CustomerContractModel;
  activity_description_id: string;
  activity_description: ActivityDescriptionModel;
  event_id: string;
  event_type: string
}

export interface ProductItemModel {
  id: string;
  product_id: string;
  product?: ProductModel;
  serial_number: string;
  logs: ProductItemLogCategory[]
  created_by_id: string;
  created_by?: UserModel;
  created_at: string
}
