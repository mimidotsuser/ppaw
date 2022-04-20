import { MRFModel } from './m-r-f.model';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';

export interface StockBalanceActivityModel {
  id: number;
  product_id: number;
  product?: ProductModel;
  stock_balance_id: number;
  qty_in_before: number;
  qty_in_after: number;
  qty_out_before: number;
  qty_out_after: number;
  restock_qty_before: number;
  restock_qty_after: number;
  qty_pending_issue_before: number;
  qty_pending_issue_after: number;
  remarks?: number;
  event_id: number;
  event_type: string;
  event?: MRFModel;
  created_by_id: number;
  created_by?: UserModel;
  created_at: string;
}
