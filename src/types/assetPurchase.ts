// types/assetPurchase.ts

export interface TAssetPurchase {
  id: string;
  room_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  purchase_date: string;
  notes?: string;
  added_by?: string;
  room: {
    id: string;
    name: string;
    floor?: string;
    department?: string;
  };
  item: {
    id: string;
    name: string;
    category?: string;
    unit?: string;
  };
  user?: {
    id: string;
    name: string;
    mobile: string;
  };
  created_at: string;
  updated_at: string;
}

export interface TCreateAssetPurchasePayload {
  room_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  purchase_date?: string;
  notes?: string;
}

export interface TUpdateAssetPurchasePayload {
  room_id?: string;
  item_id?: string;
  quantity?: number;
  unit_price?: number;
  purchase_date?: string;
  notes?: string;
}

export interface TPurchaseSummary {
  total_purchases: number;
  total_cost: number;
  by_room: Array<{
    room_id: string;
    room_name: string;
    total_items: number;
    total_cost: number;
    items: Array<{
      item_name: string;
      quantity: number;
      unit_price: number;
      total_cost: number;
    }>;
  }>;
  by_item: Array<{
    item_id: string;
    item_name: string;
    total_quantity: number;
    total_cost: number;
    rooms: Array<{
      room_name: string;
      quantity: number;
      unit_price: number;
      total_cost: number;
    }>;
  }>;
}
