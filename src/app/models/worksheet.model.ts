import { UserModel } from './user.model';
import { CustomerModel } from './customer.model';
import { ActivityDescriptionModel } from './activity-description.model';
import { ProductItemModel } from './product-item.model';

export enum WorkCategory {
  DELIVERY_AND_INSTALLATION = 'Delivery and Installation',
  TRAINING_AND_INSTALLATION = 'Training and Installation',
  MACHINE_REPAIR = 'Machine Repair',
  GENERAL_SERVICING = 'Service and Maintenance',
  TECHNICAL_REPORT = 'Technical Report',
  OTHER = 'Other'
}


export interface WorksheetModel {
  id: string;
  reference_number: string;
  category_code: keyof typeof WorkCategory;
  category: WorkCategory;
  remarks: string;
  client_id: string;
  client?: CustomerModel;
  activity_description_id: string;
  activity_description: ActivityDescriptionModel;
  product_items: ProductItemModel[];
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}
