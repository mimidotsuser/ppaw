import { UserModel } from './user.model';

export interface CustomerModel {
  id: string;
  parent_id: string | null;
  name: string;
  branch?: string;
  region?: string;
  location?: string;
  contracts_total?: number;
  created_by?: UserModel;
  created_by_id?: string;
  created_at?: string;
  parent?: CustomerModel
}
