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
  customer_id: number
  created_at: string
  total: number
  name: string
}
