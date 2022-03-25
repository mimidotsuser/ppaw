import { UserModel } from './user.model';

export interface CustomerModel {
  id: number;
  parent_id?: number;
  name: string;
  branch?: string;
  region?: string;
  location?: string;
  contracts_total?: number;
  created_by?: UserModel;
  created_by_id?: number;
  created_at?: string;
  parent?: CustomerModel
}
