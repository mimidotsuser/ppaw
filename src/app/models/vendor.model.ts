import { UserModel } from './user.model';

export interface VendorContactPerson {
  first_name: string;
  last_name?: string;
  mobile?: string;
  email?: string;
}

export interface VendorModel {
  id: number;
  name: string;
  telephone?: string;
  email?: string;
  street_address?: string;
  postal_address?: string;
  mobile_phone?: string;
  website?: string;
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  contactPersons: VendorContactPerson[]
}
