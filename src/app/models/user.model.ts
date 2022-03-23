import { RoleModel } from './role.model';

export const UserAccountStatus: { ACTIVE: string; SUSPENDED: string; PENDING_ACTIVATION: string } =
  {
    PENDING_ACTIVATION: 'Pending Activation',
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended'
  }

export interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: RoleModel;
  role_id: string;
  status: keyof typeof UserAccountStatus;
  created_by?: UserModel;
  created_by_id?: string;
}
