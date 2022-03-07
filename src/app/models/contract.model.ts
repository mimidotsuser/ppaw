import { ClientModel } from './client.model';
import { UserModel } from './user.model';

export interface ContractModel {
  id: string;
  reference: string;
  client_id: string;
  client?: ClientModel;
  start_date: string;
  expiry_date: string;
  created_by_id: string;
  created_by?: UserModel;
}
