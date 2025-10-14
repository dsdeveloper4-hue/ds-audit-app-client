"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllAuditsQuery,
  useDeleteAuditMutation,
  useCompleteAuditMutation,
} from "@/redux/features/audit/auditApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2, CheckCircle, Loader2 } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TAudit } from "@/types";
import { toast } from "sonner";

export default function AuditsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetAllAuditsQuery();
  const [deleteAudit, { isLoading: isDeleting }] = useDeleteAuditMutation();
  const [completeAudit, { isLoading: isCompleting }] =
    useCompleteAuditMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const audits = data?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this audit?")) return;
    setDeletingId(id);
    try {
      await deleteAudit(id).unwrap();
      toast.success("Audit deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete audit:", err);
      toast.error(err?.data?.message || "Failed to delete audit. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to complete this audit? This will update inventory quantities."
      )
    )
      return;
    setCompletingId(id);
    try {
      await completeAudit(id).unwrap();
      toast.success("Audit completed successfully! Inventory quantities updated.");
    } catch (err: any) {
      console.error("Failed to complete audit:", err);
      toast.error(err?.data?.message || "Failed to complete audit. Please try again.");
    } finally {
      setCompletingId(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Audits
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track inventory audits
          </p>
        </div>
        <Button onClick={() => router.push("/audits/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Audit
        </Button>
      </div>

      {/* Audits Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audit Date</TableHead>
                <TableHead>Month/Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Conducted By</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No audits found. Create your first audit to get started.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((audit: TAudit) => (
                  <TableRow key={audit.id}>
                    <TableCell>
                      {new Date(audit.audit_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(audit.year, audit.month - 1).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(audit.status)}</TableCell>
                    <TableCell>
                      {audit.conductor?.name || "Not assigned"}
                    </TableCell>
                    <TableCell>
                      <span className="truncate max-w-xs block">
                        {audit.notes || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/audits/${audit.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {audit.status === "in_progress" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleComplete(audit.id)}
                            disabled={completingId === audit.id}
                          >
                            {completingId === audit.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(audit.id)}
                          disabled={deletingId === audit.id}
                        >
                          {deletingId === audit.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
