export interface WarehouseModel {
  id: number;
  name: string;
  location: string;
  created_by_id?: number,
  updated_by_id?: number
  created_at?: string
  updated_at?: string
}
