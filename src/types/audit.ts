// types/audit.ts
import { TItemDetail } from "./itemDetail";

export interface TAudit {
  id: string;
  month: number;
  year: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  notes?: string;
  reduction_percentage?: number;
  participants?: TParticipant[];
  itemDetails?: TItemDetail[];
  detailsByRoom?: TDetailsByRoom[];
  _count?: {
    itemDetails: number;
  };
  created_at: string;
  updated_at: string;
}

export interface TParticipant {
  id: string;
  name: string;
  mobile: string;
}

export interface TDetailsByRoom {
  room: {
    id: string;
    name: string;
    floor?: string;
    department?: string;
  };
  items: TItemDetail[];
}

export interface TCreateAuditPayload {
  month: number;
  year: number;
  notes?: string;
  participant_ids?: string[];
}

export interface TUpdateAuditPayload {
  status?: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  notes?: string;
  participant_ids?: string[];
}

export interface TAuditWithDetails extends TAudit {
  itemDetails: TItemDetail[];
  detailsByRoom: TDetailsByRoom[];
  history?: TAuditHistory[];
}

export interface TAuditHistory {
  id: string;
  audit_id: string;
  item_id?: string;
  room_id?: string;
  user_id: string;
  change_type: string;
  old_value?: string;
  new_value?: string;
  description?: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    mobile: string;
  };
  item?: {
    id: string;
    name: string;
  };
  room?: {
    id: string;
    name: string;
  };
}
