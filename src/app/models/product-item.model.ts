import { ProductModel } from './product.model';
import { UserModel } from './user.model';
import { CustomerModel } from './customer.model';
import { CustomerContractModel } from './customer-contract.model';
import { ActivityDescriptionModel } from './activity-description.model';
import { WarehouseModel } from './warehouse.model';
import { ProductItemWarrant } from './product-item-warrant.model';

export enum ProductItemActivityCategoryCode {
  CONTRACT_ASSIGNED = 'CONTRACT_ASSIGNED',
  CONTRACT_UPDATED = 'CONTRACT_UPDATED',
  INITIAL_ENTRY = 'INITIAL_ENTRY',
  DEMO_CHECKIN = 'DEMO_CHECKIN',
  STANDBY_CHECKIN = 'STANDBY_CHECKIN',
  LEASE_CHECKIN = 'LEASE_CHECKIN',
  CUSTOMER_TRANSFER = 'CUSTOMER_TRANSFER',
  MATERIAL_REQUISITION_ISSUED = 'MATERIAL_REQUISITION_ISSUED',
  REPAIR = 'REPAIR',
  GENERAL_SERVICING = 'GENERAL_SERVICING',
  TRAINING_AND_INSTALLATION = 'TRAINING_AND_INSTALLATION',
  DELIVERY_AND_INSTALLATION = 'DELIVERY_AND_INSTALLATION',
  TECHNICAL_REPORT = 'TECHNICAL_REPORT',
  OTHER = 'OTHER'
}

export enum ProductItemActivityCategoryTitle {
  CONTRACT_ASSIGNED = 'Contract Created',
  CONTRACT_UPDATED = 'Contract Updated',
  INITIAL_ENTRY = 'Tracking Start',
  DEMO_CHECKIN = 'Out of Demo',
  STANDBY_CHECKIN = 'Standby Reminder',
  LEASE_CHECKIN = 'Out of Lease',
  CUSTOMER_TRANSFER = 'Customer/Branch Transfer',
  MATERIAL_REQUISITION_ISSUED = 'MRN issued',
  REPAIR = 'Machine Repair',
  GENERAL_SERVICING = 'Service and Maintenance',
  TRAINING_AND_INSTALLATION = 'Training and Installation',
  DELIVERY_AND_INSTALLATION = 'Delivery and Installation',
  TECHNICAL_REPORT = 'Technical Report',
  OTHER = 'Other'
}

export interface ProductItemActivityModel {
  id: number;
  product_item_id: number;
  location_id: number;
  location_type: 'customer' | 'warehouse';
  location: CustomerModel | WarehouseModel
  customer_contract_id?: number;
  product_warrant_id: number;
  warrant?: ProductItemWarrant;
  entry_remark_id?: number;
  remark?: { id: number, description: string };
  product_repair_id?: number;
  repair?: { id: number, spares_utilized: ProductModel[] };
  log_category_code: ProductItemActivityCategoryCode;
  log_category_title: ProductItemActivityCategoryTitle;
  customerContract?: CustomerContractModel;
  activity_description_id: string;
  activity_description: ActivityDescriptionModel;
  eventable_id: string;
  eventable_type: string;
  created_by_id: number;
  updated_by_id: number;
  created_by?: UserModel;
  created_at: string;
  updated_at: string;
}

export interface ProductItemModel {
  id: number;
  product_id: number;
  product?: ProductModel;
  serial_number: string;
  out_of_order: boolean;
  entry_logs?: ProductItemActivityModel[];
  latest_entry_log?: ProductItemActivityModel;
  purchase_order_id?: number;
  created_by_id: number;
  updated_by_id: number;
  created_by?: UserModel;
  created_at: string
  updated_at: string
}
