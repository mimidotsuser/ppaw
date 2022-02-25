import { RoleModel } from './role.model';

enum Status {
  PENDING_ACTIVATION,
  ACTIVE,
  SUSPENDED
}

export interface UserModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: RoleModel;
  role_id: string;
  status: Status;
  created_by?: UserModel;
  created_by_id?: string;
}
