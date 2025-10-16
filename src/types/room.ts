// types/room.ts
export interface TRoom {
  id: string;
  name: string;
  floor?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface TCreateRoomPayload {
  name: string;
  floor?: string;
  department?: string;
}

export interface TUpdateRoomPayload {
  name?: string;
  floor?: string;
  department?: string;
}
