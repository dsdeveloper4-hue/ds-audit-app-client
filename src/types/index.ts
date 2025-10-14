export * from  './user'
export * from "./products";
export * from "./sales";
export * from "./audit";
export * from "./auditRecord";
export * from "./room";
export * from "./item";
export * from "./inventory";

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
