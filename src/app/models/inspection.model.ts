import { UserModel } from './user.model';

enum CheckInTypes {
  PURCHASED_PRODUCT = 'PURCHASED_PRODUCT',
}

export interface InspectionReportModel {
  id: string;
  feature: string;
  passed: boolean;
  created_at: string;
  created_by_id: string;
}

export interface InspectionModel {
  id: string;
  checkin_id: string;
  checkin_type: CheckInTypes.PURCHASED_PRODUCT
  report: InspectionReportModel[];
  created_at: string;
  created_by_id: string;
  created_by?: UserModel;
}
