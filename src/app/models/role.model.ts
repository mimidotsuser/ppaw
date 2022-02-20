import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';

export interface RoleModel {
  id: string;
  name: string;
  description: string;
  permissions: [] | PermissionModel[];
  created_by?: UserModel;
  created_by_id?: string;
}
