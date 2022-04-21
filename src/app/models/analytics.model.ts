export interface ProductItemByLocationAnalytics {
  total: number
  location: 'customer' | 'warehouse'
}

export interface ProductOutOfStockAnalytics {
  total: number
  category_id: number
  name: 'Machine' | 'Spare'
}


export interface WorksheetByCustomerAnalytics {
  branch?: string;
  region?: string;
  customer_id: number
  created_at: string
  total: number
  name: string
}


export interface WorksheetByAuthorAnalytics {
  total: number;
  name: string;
}
