"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllAuditsQuery,
  useDeleteAuditMutation,
} from "@/redux/features/audit/auditApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Calendar, Eye, FileText } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { AuditForm } from "@/components/forms/AuditForm";
import { TAudit } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRole } from "@/hooks/useRole";

export default function AuditsPage() {
  const router = useRouter();
  const { canManageUsers } = useRole();
  const [showForm, setShowForm] = useState(false);
  const [editingAudit, setEditingAudit] = useState<TAudit | null>(null);
  const { data, isLoading, error } = useGetAllAuditsQuery();
  const [deleteAudit] = useDeleteAuditMutation();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const audits = data?.data || [];

  const handleDelete = (audit: TAudit) => {
    confirm({
      title: "Delete Audit",
      description: `Are you sure you want to delete the audit for ${getMonthYear(audit)}? This action cannot be undone and will remove all associated item details.`,
      confirmText: "Delete Audit",
      variant: "destructive",
      onConfirm: async () => {
        await deleteAudit(audit.id).unwrap();
        toast.success("Audit deleted successfully!");
      },
    });
  };

  const handleEdit = (audit: TAudit) => {
    setEditingAudit(audit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAudit(null);
  };

  const getMonthYear = (audit: TAudit) => {
    return new Date(audit.year, audit.month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      IN_PROGRESS: "secondary",
      COMPLETED: "default",
      CANCELED: "destructive",
    };

    const colors: Record<string, string> = {
      IN_PROGRESS:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      COMPLETED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <Badge
        variant={variants[status] || "secondary"}
        className={colors[status]}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const columns = [
    {
      key: "created_at",
      header: "Audit Date",
      render: (audit: TAudit) =>
        audit.created_at
          ? new Date(audit.created_at).toLocaleDateString()
          : "N/A",
    },
    {
      key: "month",
      header: "Month/Year",
      render: (audit: TAudit) => getMonthYear(audit),
    },
    {
      key: "status",
      header: "Status",
      render: (audit: TAudit) => getStatusBadge(audit.status),
    },
    {
      key: "participants",
      header: "Conducted By",
      render: (audit: TAudit) =>
        audit.participants && audit.participants.length > 0
          ? audit.participants.map((p) => p.name).join(", ")
          : "Not assigned",
    },
    {
      key: "notes",
      header: "Notes",
      render: (audit: TAudit) => (
        <span className="truncate max-w-xs block">{audit.notes || "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (audit: TAudit) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={() => router.push(`/audits/${audit.id}`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Audit
          </Button>

          {canManageUsers && (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleEdit(audit)}
                title="Edit Audit"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(audit)}
                title="Delete Audit"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Audits"
        description="Manage and track inventory audits"
        icon={<Calendar className="h-8 w-8" />}
        actions={
          canManageUsers ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Audit
            </Button>
          ) : undefined
        }
      />

      <AuditForm
        isOpen={showForm}
        onClose={handleCloseForm}
        audit={editingAudit || undefined}
        onSuccess={() => {
          // Refresh data is handled by RTK Query cache invalidation
        }}
      />

      <DataTable
        data={audits}
        columns={columns}
        emptyMessage="No audits found. Create your first audit to get started."
        emptyIcon={<Calendar className="h-12 w-12 text-gray-300" />}
      />

      {ConfirmationDialog}
    </motion.div>
  );
}
