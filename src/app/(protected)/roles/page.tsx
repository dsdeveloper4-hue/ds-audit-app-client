"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/redux/features/role/roleApi";
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
import { Plus, Edit2, Trash2, X, Loader2, Shield, Users } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TRole } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PermissionGuard from "@/components/shared/PermissionGuard";

export default function RolesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetAllRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<TRole | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const roles = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingRole(null);
    setShowForm(false);
  };

  const handleEdit = (role: TRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingId(editingRole?.id || "new");

    try {
      if (editingRole) {
        await updateRole({ id: editingRole.id, payload: formData }).unwrap();
        toast.success("Role updated successfully!");
      } else {
        await createRole(formData).unwrap();
        toast.success("Role created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save role:", err);
      toast.error(err?.data?.message || "Failed to save role. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete role "${name}"?`)) return;
    setSavingId(id);

    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete role:", err);
      toast.error(err?.data?.message || "Failed to delete role. Please try again.");
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
            <Shield className="h-8 w-8" />
            Roles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage roles and their permissions
          </p>
        </div>
        {!showForm && (
          <PermissionGuard resource="role" action="create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
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
                  {editingRole ? "Edit Role" : "Add New Role"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Manager, Auditor"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={savingId === (editingRole?.id || "new")}
                    className="min-w-[100px]"
                  >
                    {savingId === (editingRole?.id || "new") ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingRole ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={savingId === (editingRole?.id || "new")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roles Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Shield className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No roles found. Add your first role to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role: TRole, index: number) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {role.permissions?.length || 0} permissions
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{role._count?.users || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <PermissionGuard resource="role" action="update">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => router.push(`/roles/${role.id}`)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(role)}
                              disabled={savingId === role.id}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                          <PermissionGuard resource="role" action="delete">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(role.id, role.name)}
                              disabled={savingId === role.id}
                            >
                              {savingId === role.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </PermissionGuard>
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
