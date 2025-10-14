"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAuditByIdQuery,
  useCompleteAuditMutation,
} from "@/redux/features/audit/auditApi";
import {
  useGetAuditRecordsByAuditIdQuery,
  useUpdateAuditRecordMutation,
} from "@/redux/features/auditRecord/auditRecordApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Save,
  Building,
  Package,
} from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TAuditRecord } from "@/types";
import { toast } from "sonner";

export default function AuditDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: auditData, isLoading: auditLoading } = useGetAuditByIdQuery(id);
  const { data: recordsData, isLoading: recordsLoading } =
    useGetAuditRecordsByAuditIdQuery(id);
  const [updateRecord] = useUpdateAuditRecordMutation();
  const [completeAudit, { isLoading: isCompleting }] =
    useCompleteAuditMutation();

  const [editingRecords, setEditingRecords] = useState<Record<string, any>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  if (auditLoading || recordsLoading) return <Loading />;
  if (!auditData?.data) return <Error />;

  const audit = auditData.data;
  const records = recordsData?.data || [];

  const handleFieldChange = (
    recordId: string,
    field: string,
    value: string
  ) => {
    setEditingRecords((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleSaveRecord = async (recordId: string) => {
    if (!editingRecords[recordId]) return;

    setSavingIds((prev) => new Set(prev).add(recordId));
    try {
      await updateRecord({
        id: recordId,
        payload: editingRecords[recordId],
      }).unwrap();

      // Clear editing state after successful save
      setEditingRecords((prev) => {
        const newState = { ...prev };
        delete newState[recordId];
        return newState;
      });
      toast.success("Audit record updated successfully!");
    } catch (error: any) {
      console.error("Failed to update record:", error);
      toast.error(error?.data?.message || "Failed to update record. Please try again.");
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const handleCompleteAudit = async () => {
    if (
      !confirm(
        "Are you sure you want to complete this audit? This will update all inventory quantities and cannot be undone."
      )
    )
      return;

    try {
      await completeAudit(id).unwrap();
      toast.success("Audit completed successfully! Inventory updated.");
      router.push("/audits");
    } catch (error: any) {
      console.error("Failed to complete audit:", error);
      toast.error(error?.data?.message || "Failed to complete audit. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      in_progress: "secondary",
      completed: "default",
      reviewed: "default",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getValue = (
    record: TAuditRecord,
    field: keyof TAuditRecord,
    recordId: string
  ) => {
    if (editingRecords[recordId] && field in editingRecords[recordId]) {
      return editingRecords[recordId][field];
    }
    return record[field];
  };

  const isEdited = (recordId: string) => {
    return editingRecords[recordId] && Object.keys(editingRecords[recordId]).length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Audits
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {new Date(audit.year, audit.month - 1).toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge(audit.status)}
            {audit.status === "in_progress" && (
              <Button
                onClick={handleCompleteAudit}
                disabled={isCompleting}
                className="min-w-[140px]"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Audit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Audit Date
            </p>
            <p className="text-lg font-semibold">
              {new Date(audit.audit_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conducted By
            </p>
            <p className="text-lg font-semibold">
              {audit.conductor?.name || "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Records
            </p>
            <p className="text-lg font-semibold">{records.length}</p>
          </div>
        </div>
        {audit.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
            <p className="text-base mt-1">{audit.notes}</p>
          </div>
        )}
      </Card>

      {/* Audit Records */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Audit Records</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Broken</TableHead>
                <TableHead className="text-center">Inactive</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No audit records found.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record: TAuditRecord) => (
                  <TableRow
                    key={record.id}
                    className={
                      isEdited(record.id) ? "bg-yellow-50 dark:bg-yellow-950" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {record.inventory?.room?.name || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{record.inventory?.item?.name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.inventory?.item?.unit || "—"}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(record, "recorded_active", record.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            record.id,
                            "recorded_active",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "in_progress"}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(record, "recorded_broken", record.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            record.id,
                            "recorded_broken",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "in_progress"}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(record, "recorded_inactive", record.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            record.id,
                            "recorded_inactive",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "in_progress"}
                      />
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {Number(getValue(record, "recorded_active", record.id) || 0) +
                        Number(getValue(record, "recorded_broken", record.id) || 0) +
                        Number(getValue(record, "recorded_inactive", record.id) || 0)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={getValue(record, "notes", record.id) || ""}
                        onChange={(e) =>
                          handleFieldChange(record.id, "notes", e.target.value)
                        }
                        placeholder="Add notes..."
                        className="min-w-[150px]"
                        disabled={audit.status !== "in_progress"}
                      />
                    </TableCell>
                    <TableCell>
                      {audit.status === "in_progress" && isEdited(record.id) && (
                        <Button
                          size="sm"
                          onClick={() => handleSaveRecord(record.id)}
                          disabled={savingIds.has(record.id)}
                        >
                          {savingIds.has(record.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
