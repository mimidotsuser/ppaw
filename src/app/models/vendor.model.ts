import { UserModel } from './user.model';

export interface VendorModel {
  id: number;
  name: string;
  telephone?: string;
  email?: string;
  address?: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  contactPerson?: {
    first_name: string;
    last_name?: string;
    mobile?: string;
    email?: string;
  }[],
}
