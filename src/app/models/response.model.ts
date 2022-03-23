export interface HttpResponseModel<T> {
  data: T[];
  per_page: number;
  total: number;
  current_page: number;
  last_page: number;
}

export interface ErrorResponseModel {
  message: string;
  errors?: { [ key: string ]: string[] | string }
}
