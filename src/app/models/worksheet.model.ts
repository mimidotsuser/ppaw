import { UserModel } from './user.model';
import { ClientModel } from './client.model';

export enum WorksheetType {
  DELIVERY_AND_INSTALLATION,
  TRAINING_AND_INSTALLATION,
  MACHINE_REPAIR,
  GENERAL_SERVICING,
  TECHNICAL_REPORT,
  OTHER
}

export interface WorksheetModel {
  id: string;
  work_type: WorksheetType;
  remarks: string;
  client_id: string;
  client?: ClientModel;
  created_by_id: string;
  created_by?: UserModel;
  created_at: string;
}
