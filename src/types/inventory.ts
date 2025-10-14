// types/inventory.ts
export interface TInventory {
  id: string;
  room_id: string;
  item_id: string;
  current_quantity: number;
  active_quantity: number;
  broken_quantity: number;
  inactive_quantity: number;
  room?: {
    id: string;
    name: string;
    description?: string;
    floor?: string;
    department?: string;
  };
  item?: {
    id: string;
    name: string;
    category: string;
    unit: string;
    description?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface TCreateInventoryPayload {
  room_id: string;
  item_id: string;
  current_quantity?: number;
  active_quantity?: number;
  broken_quantity?: number;
  inactive_quantity?: number;
}

export interface TCreateBulkInventoryPayload {
  inventories: Array<{
    room_id: string;
    item_id: string;
    current_quantity?: number;
    active_quantity?: number;
    broken_quantity?: number;
    inactive_quantity?: number;
  }>;
}

export interface TUpdateInventoryPayload {
  current_quantity?: number;
  active_quantity?: number;
  broken_quantity?: number;
  inactive_quantity?: number;
}
