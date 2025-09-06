export * from  './user'
export * from "./products";

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
