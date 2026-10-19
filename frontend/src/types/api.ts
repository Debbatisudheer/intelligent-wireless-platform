export interface ApiMeta {
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: string[];
  };
}