"use client";

import React, { useState } from "react";
import {
  useGetAllPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "@/redux/features/permission/permissionApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, X, Loader2, Key } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TPermission } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PermissionGuard from "@/components/shared/PermissionGuard";

export default function PermissionsPage() {
  const { data, isLoading, error } = useGetAllPermissionsQuery();
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<TPermission | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    resource: "",
    action: "",
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const permissions = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      resource: "",
      action: "",
    });
    setEditingPermission(null);
    setShowForm(false);
  };

  const handleEdit = (permission: TPermission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingId(editingPermission?.id || "new");

    try {
      if (editingPermission) {
        await updatePermission({
          id: editingPermission.id,
          payload: formData,
        }).unwrap();
        toast.success("Permission updated successfully!");
      } else {
        await createPermission(formData).unwrap();
        toast.success("Permission created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save permission:", err);
      toast.error(err?.data?.message || "Failed to save permission. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete permission "${name}"?`)) return;
    setSavingId(id);

    try {
      await deletePermission(id).unwrap();
      toast.success("Permission deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete permission:", err);
      toast.error(err?.data?.message || "Failed to delete permission. Please try again.");
    } finally {
      setSavingId(null);
    }
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
      transition: { duration: 0.4 },
    },
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc: Record<string, TPermission[]>, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {});

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
            <Key className="h-8 w-8" />
            Permissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system permissions
          </p>
        </div>
        {!showForm && (
          <PermissionGuard resource="permission" action="create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </motion.div>
          </PermissionGuard>
        )}
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingPermission ? "Edit Permission" : "Add New Permission"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Permission Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Create Audit"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource">Resource *</Label>
                    <Input
                      id="resource"
                      value={formData.resource}
                      onChange={(e) =>
                        setFormData({ ...formData, resource: e.target.value })
                      }
                      placeholder="e.g., audit, role"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action *</Label>
                    <select
                      id="action"
                      value={formData.action}
                      onChange={(e) =>
                        setFormData({ ...formData, action: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="">Select action</option>
                      <option value="create">Create</option>
                      <option value="read">Read</option>
                      <option value="update">Update</option>
                      <option value="delete">Delete</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={savingId === (editingPermission?.id || "new")}
                    className="min-w-[100px]"
                  >
                    {savingId === (editingPermission?.id || "new") ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingPermission ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={savingId === (editingPermission?.id || "new")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permissions Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Key className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No permissions found. Add your first permission to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedPermissions).map(([resource, perms], groupIndex) => (
                    <React.Fragment key={resource}>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableCell colSpan={5} className="font-semibold uppercase text-xs text-gray-600 dark:text-gray-400">
                          {resource}
                        </TableCell>
                      </TableRow>
                      {perms.map((permission: TPermission, index: number) => (
                        <motion.tr
                          key={permission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupIndex * perms.length + index) * 0.03 }}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{permission.resource}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{permission.action}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {permission._count?.roles || 0} roles
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <PermissionGuard resource="permission" action="update">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(permission)}
                                  disabled={savingId === permission.id}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard resource="permission" action="delete">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(permission.id, permission.name)}
                                  disabled={savingId === permission.id}
                                >
                                  {savingId === permission.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </PermissionGuard>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </React.Fragment>
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
