import { PermissionModel } from './permission.model';

export interface RoleModel {
  id: string;
  name: string;
  description: string;
  permissions: [] | PermissionModel[];
  created_by: string;
}
