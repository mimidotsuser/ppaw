
export interface ProductItemWarrant {
  id: number;
  product_item_id: number;
  customer_id: number;
  warrant_start?: string;
  warrant_end: string;
  created_by_id: number;
  updated_by_id: number
  created_at: string;
  updated_at: string;
}
