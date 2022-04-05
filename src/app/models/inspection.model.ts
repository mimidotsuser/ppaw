import { UserModel } from './user.model';
import { GoodsReceiptNoteModel } from './goods-receipt-note.model';

enum CheckInTypes {
  PURCHASED_PRODUCT = 'PURCHASED_PRODUCT',
}

export interface InspectionChecklistModel {
  id: number;
  feature: string;
  passed: boolean;
  created_at: string;
  created_by_id: string;
}

export interface InspectionModel {
  id: number;
  sn: string;
  checklist: InspectionChecklistModel[];
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
  goods_receipt_note?: GoodsReceiptNoteModel
}
