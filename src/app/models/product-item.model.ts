import { ProductModel } from './product.model';
import { UserModel } from './user.model';
import { CustomerModel } from './customer.model';
import { CustomerContractModel } from './customer-contract.model';
import { ActivityDescriptionModel } from './activity-description.model';
import { WarehouseModel } from './warehouse.model';
import { ProductItemWarrant } from './product-item-warrant.model';
import { PurchaseOrderModel } from './purchase-order.model';

export enum ProductItemActivityCategoryCode {
  CONTRACT_ASSIGNED = 'CONTRACT_ASSIGNED',
  CONTRACT_UPDATED = 'CONTRACT_UPDATED',
  INITIAL_ENTRY = 'INITIAL_ENTRY',
  CUSTOMER_TO_CUSTOMER_TRANSFER = 'CUSTOMER_TO_CUSTOMER_TRANSFER',
  CUSTOMER_TO_WAREHOUSE_TRANSFER = 'CUSTOMER_TO_WAREHOUSE_TRANSFER',
  WAREHOUSE_TO_WAREHOUSE_TRANSFER = 'WAREHOUSE_TO_WAREHOUSE_TRANSFER',
  WARRANTY_UPDATE = 'WARRANTY_UPDATE',
  MATERIAL_REQUISITION_ISSUED = 'MATERIAL_REQUISITION_ISSUED',
  REPAIR = 'REPAIR',
  GENERAL_SERVICING = 'GENERAL_SERVICING',
  TRAINING_AND_INSTALLATION = 'TRAINING_AND_INSTALLATION',
  DELIVERY_AND_INSTALLATION = 'DELIVERY_AND_INSTALLATION',
  TECHNICAL_REPORT = 'TECHNICAL_REPORT',
  OTHER = 'OTHER'
}

export interface ProductItemRepairModel {
  id: number;
  spares_utilized?: { new_total: number, old_total: number, product_id: number, product?: ProductModel }[]
  products: (ProductModel & { pivot: { new_total: number, old_total: number } }) []
}

export interface ProductItemActivityModel {
  id: number;
  product_item_id: number;
  product_item?: ProductItemModel;
  location_id: number;
  location_type: 'customer' | 'warehouse';
  location: CustomerModel | WarehouseModel
  customer_contract_id?: number;
  contract?: CustomerContractModel;
  product_warrant_id?: number;
  warrant?: ProductItemWarrant;
  entry_remark_id?: number;
  remark?: ActivityDescriptionModel;
  product_repair_id?: number;
  repair?: ProductItemRepairModel;
  log_category_code: ProductItemActivityCategoryCode;
  log_category_title: string;
  eventable_id?: string;
  eventable_type?: string;
  covenant: string;
  created_by_id: number;
  updated_by_id: number;
  created_by?: UserModel;
  created_at: string;
  updated_at: string;
}

export interface ProductItemModel {
  id: number;
  sn: string;
  product_id: number;
  product?: ProductModel;
  serial_number: string;
  out_of_order: boolean;
  activities?: ProductItemActivityModel[];
  latest_activity?: ProductItemActivityModel;
  purchase_order_id?: number;
  purchase_order?: PurchaseOrderModel;
  active_warrant?: ProductItemWarrant;
  latest_contracts?: CustomerContractModel[];
  created_by_id: number;
  updated_by_id: number;
  created_by?: UserModel;
  created_at: string
  updated_at: string
}
