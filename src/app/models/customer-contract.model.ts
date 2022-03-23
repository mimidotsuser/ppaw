import { CustomerModel } from './customer.model';
import { UserModel } from './user.model';

export interface CustomerContractModel {
  id: string;
  reference: string;
  client_id: string;
  client?: CustomerModel;
  start_date: string;
  expiry_date: string;
  created_by_id: string;
  created_by?: UserModel;
}
