export interface WorksheetFiltersModel {
  customers?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  entry_categories?: string
}

export interface MaterialRequisitionFiltersModel {
  stages?: string;
  status?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
}

export interface PurchaseRequestFiltersModel {
  stages?: string;
  status?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
}
