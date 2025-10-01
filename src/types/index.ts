export * from  './user'
export * from "./products";
export * from "./sales";

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
