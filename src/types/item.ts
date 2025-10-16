// types/item.ts
export interface TItem {
  id: string;
  name: string;
  category?: string;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface TCreateItemPayload {
  name: string;
  category: string;
  unit: string;
}

export interface TUpdateItemPayload {
  name?: string;
  category?: string;
  unit?: string;
}
