export * from './user'
export * from "./audit";
export * from "./room";
export * from "./item";
export * from "./permission";
export * from "./itemDetail";
export * from "./activity";

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
