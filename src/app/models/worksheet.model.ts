import { UserModel } from './user.model';
import { CustomerModel } from './customer.model';
import { ActivityDescriptionModel } from './activity-description.model';
import { ProductItemRepairModel } from './product-item.model';

export enum WorkCategoryCodes {
  DELIVERY_AND_INSTALLATION = 'DELIVERY_AND_INSTALLATION',
  TRAINING_AND_INSTALLATION = 'TRAINING_AND_INSTALLATION',
  REPAIR = 'REPAIR',
  GENERAL_SERVICING = 'GENERAL_SERVICING',
  TECHNICAL_REPORT = 'TECHNICAL_REPORT',
  OTHER = 'OTHER'
}

export enum WorkCategoryTitles {
  DELIVERY_AND_INSTALLATION = 'Delivery and Installation',
  TRAINING_AND_INSTALLATION = 'Training and Installation',
  REPAIR = 'Machine Repair',
  GENERAL_SERVICING = 'Service and Maintenance',
  TECHNICAL_REPORT = 'Technical Report',
  OTHER = 'Other'
}

export interface WorksheetEntryModel {
  id: number;
  product_item_id: number;
  location_id: number;
  location_type: 'customer',
  customer_contract_id: number;
  product_item_warrant_id?: number;
  entry_remark_id?: number
  remark?: string
  product_item_repair_id?: number;
  repair?: ProductItemRepairModel
  log_category_code: string
  log_category_title: string
  covenant?: string
  eventable_id: string;
  eventable_type: 'worksheet',
  created_by_id: number;
  updated_by_id: number;
  created_at: string;
  updated_at: string;
  created_by?: UserModel;

}

export interface WorksheetModel {
  id: number;
  sn: string;
  reference: string;
  customer_id: string;
  customer?: CustomerModel;
  entry_remark_id?: number;
  remark?: ActivityDescriptionModel;
  entries?: WorksheetEntryModel[]
  created_by_id: number;
  updated_by_id: number;
  created_by?: UserModel;
  created_at: string;
}
