"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllAuditsQuery,
  useDeleteAuditMutation,
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
import { Plus, Eye, Trash2, Loader2, Calendar } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TAudit } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import PermissionGuard from "@/components/shared/PermissionGuard";

export default function AuditsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetAllAuditsQuery();
  const [deleteAudit] = useDeleteAuditMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <ListPageSkeleton />;
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
      toast.error(
        err?.data?.message || "Failed to delete audit. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Audits
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track inventory audits
          </p>
        </div>
        <PermissionGuard resource="audit" action="create">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => router.push("/audits/create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Audit
            </Button>
          </motion.div>
        </PermissionGuard>
      </motion.div>

      {/* Audits Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
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
                  audits.map((audit: TAudit, index: number) => (
                    <motion.tr
                      key={audit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell>
                        {audit.created_at
                          ? new Date(audit.created_at).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          audit.year,
                          audit.month - 1
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(audit.status)}</TableCell>
                      <TableCell>
                        {audit.participants && audit.participants.length > 0
                          ? audit.participants.map((p) => p.name).join(", ")
                          : "Not assigned"}
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
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
