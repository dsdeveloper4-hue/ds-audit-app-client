// types/auditRecord.ts
export interface TAuditRecord {
  id: string;
  audit_id: string;
  inventory_id: string;
  recorded_current: number;
  recorded_active: number;
  recorded_broken: number;
  recorded_inactive: number;
  notes?: string;
  inventory?: {
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
  };
  participants?: TAuditRecordParticipant[];
  created_at: string;
  updated_at: string;
}

export interface TAuditRecordParticipant {
  id: string;
  audit_record_id: string;
  user_id: string;
  user?: {
    id: string;
    name: string;
    mobile: string;
  };
  created_at: string;
}

export interface TUpdateAuditRecordPayload {
  recorded_current?: number;
  recorded_active?: number;
  recorded_broken?: number;
  recorded_inactive?: number;
  notes?: string;
}

export interface TBulkUpdateAuditRecordsPayload {
  records: Array<{
    id: string;
    recorded_current?: number;
    recorded_active?: number;
    recorded_broken?: number;
    recorded_inactive?: number;
    notes?: string;
  }>;
}

export interface TAddParticipantPayload {
  user_id: string;
}
