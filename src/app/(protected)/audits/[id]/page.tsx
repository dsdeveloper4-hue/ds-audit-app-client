"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAuditByIdQuery,
  useUpdateItemDetailMutation,
} from "@/redux/features/audit/auditApi";
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
  Loader2,
  Save,
  Building,
  Package,
} from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TItemDetail } from "@/types";
import { toast } from "sonner";

export default function AuditDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: auditData, isLoading: auditLoading } = useGetAuditByIdQuery(id);
  const [updateItemDetail] = useUpdateItemDetailMutation();

  const [editingDetails, setEditingDetails] = useState<Record<string, any>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  if (auditLoading) return <Loading />;
  if (!auditData?.data) return <Error />;

  const audit = auditData.data;
  const itemDetails = audit.itemDetails || [];

  const handleFieldChange = (
    detailId: string,
    field: string,
    value: string
  ) => {
    setEditingDetails((prev) => ({
      ...prev,
      [detailId]: {
        ...prev[detailId],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleSaveDetail = async (detailId: string) => {
    if (!editingDetails[detailId]) return;

    setSavingIds((prev) => new Set(prev).add(detailId));
    try {
      await updateItemDetail({
        detail_id: detailId,
        payload: editingDetails[detailId],
      }).unwrap();

      // Clear editing state after successful save
      setEditingDetails((prev) => {
        const newState = { ...prev };
        delete newState[detailId];
        return newState;
      });
      toast.success("Item detail updated successfully!");
    } catch (error: any) {
      console.error("Failed to update detail:", error);
      toast.error(error?.data?.message || "Failed to update detail. Please try again.");
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(detailId);
        return newSet;
      });
    }
  };


  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      IN_PROGRESS: "secondary",
      COMPLETED: "default",
      CANCELED: "destructive",
    };

    const colors: Record<string, string> = {
      IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <Badge variant={variants[status] || "secondary"} className={colors[status]}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getValue = (
    detail: TItemDetail,
    field: keyof TItemDetail,
    detailId: string
  ) => {
    if (editingDetails[detailId] && field in editingDetails[detailId]) {
      return editingDetails[detailId][field];
    }
    return detail[field];
  };

  const isEdited = (detailId: string) => {
    return editingDetails[detailId] && Object.keys(editingDetails[detailId]).length > 0;
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
          </div>
        </div>
      </div>

      {/* Audit Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created Date
            </p>
            <p className="text-lg font-semibold">
              {new Date(audit.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Participants
            </p>
            <p className="text-lg font-semibold">
              {audit.participants && audit.participants.length > 0
                ? audit.participants.map(p => p.name).join(", ")
                : "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Item Details
            </p>
            <p className="text-lg font-semibold">{itemDetails.length}</p>
          </div>
        </div>
        {audit.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
            <p className="text-base mt-1">{audit.notes}</p>
          </div>
        )}
      </Card>

      {/* Item Details */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Item Details</h2>
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
              {itemDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No item details found.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                itemDetails.map((detail: TItemDetail) => (
                  <TableRow
                    key={detail.id}
                    className={
                      isEdited(detail.id) ? "bg-yellow-50 dark:bg-yellow-950" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {detail.room?.name || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{detail.item?.name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {detail.item?.unit || "—"}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(detail, "active_quantity", detail.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            detail.id,
                            "active_quantity",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "IN_PROGRESS"}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(detail, "broken_quantity", detail.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            detail.id,
                            "broken_quantity",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "IN_PROGRESS"}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={getValue(detail, "inactive_quantity", detail.id)}
                        onChange={(e) =>
                          handleFieldChange(
                            detail.id,
                            "inactive_quantity",
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                        disabled={audit.status !== "IN_PROGRESS"}
                      />
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {Number(getValue(detail, "active_quantity", detail.id) || 0) +
                        Number(getValue(detail, "broken_quantity", detail.id) || 0) +
                        Number(getValue(detail, "inactive_quantity", detail.id) || 0)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">—</span>
                    </TableCell>
                    <TableCell>
                      {audit.status === "IN_PROGRESS" && isEdited(detail.id) && (
                        <Button
                          size="sm"
                          onClick={() => handleSaveDetail(detail.id)}
                          disabled={savingIds.has(detail.id)}
                        >
                          {savingIds.has(detail.id) ? (
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
