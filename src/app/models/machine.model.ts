import { UserModel } from './user.model';

export interface MachineModel {
  id: string;
  item_code: string;
  mpn: string;
  description: string;
  local_description?: string;
  chinese_description?: string;
  eoq: number;
  minl: number;
  rol: number;
  maxl: number;
  created_by_id: string;
  created_by?: UserModel;
  edit?: boolean
}
