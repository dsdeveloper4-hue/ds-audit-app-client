// types/itemDetail.ts

export interface TItemDetail {
  id: string;
  room_id: string;
  item_id: string;
  audit_id: string;
  active_quantity: number;
  broken_quantity: number;
  inactive_quantity: number;
  room?: {
    id: string;
    name: string;
    floor?: string;
    department?: string;
  };
  item?: {
    id: string;
    name: string;
    category?: string;
    unit?: string;
    description?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface TCreateItemDetailPayload {
  room_id: string;
  item_id: string;
  active_quantity?: number;
  broken_quantity?: number;
  inactive_quantity?: number;
}

export interface TUpdateItemDetailPayload {
  active_quantity?: number;
  broken_quantity?: number;
  inactive_quantity?: number;
}
