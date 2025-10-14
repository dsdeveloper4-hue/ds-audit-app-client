// types/audit.ts
import { TAuditRecord } from "./auditRecord";

export interface TAudit {
  id: string;
  audit_date: string;
  month: number;
  year: number;
  status: "in_progress" | "completed" | "reviewed";
  notes?: string;
  conducted_by?: string;
  conductor?: {
    id: string;
    name: string;
    mobile: string;
  };
  totalRecords?: number;
  created_at: string;
  updated_at: string;
}

export interface TCreateAuditPayload {
  month: number;
  year: number;
  notes?: string;
  conducted_by?: string;
}

export interface TUpdateAuditPayload {
  month?: number;
  year?: number;
  status?: string;
  notes?: string;
  conducted_by?: string;
}

export interface TAuditWithRecords extends TAudit {
  records: TAuditRecord[];
}
