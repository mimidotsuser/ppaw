import { UserModel } from './user.model';
import { ProductModel } from './product.model';

export interface ProductSerialModel {
  id: number;
  sn: string;
  product_id: string;
  serial_number: string;
  created_by_id: string;
  created_by: UserModel;
  created_at: string;
  product?: ProductModel,
  chronicles?: ProductItemChronicleModel[]
}

export interface ProductItemChronicleModel {

}
