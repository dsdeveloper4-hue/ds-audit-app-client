"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { useGetAllRolesQuery } from "@/redux/features/role/roleApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, X, Loader2, Users as UsersIcon } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TUserWithRole } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PermissionGuard from "@/components/shared/PermissionGuard";

interface TUserFormData {
  name: string;
  mobile: string;
  password: string;
  role_id: string;
}

export default function UsersPage() {
  const { data, isLoading, error } = useGetAllUsersQuery();
  const { data: rolesData } = useGetAllRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<TUserWithRole | null>(null);
  const [formData, setFormData] = useState<TUserFormData>({
    name: "",
    mobile: "",
    password: "",
    role_id: "",
  });

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const users = data?.data || [];
  const roles = rolesData?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      password: "",
      role_id: "",
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEdit = (user: TUserWithRole) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      mobile: user.mobile,
      password: "",
      role_id: user.role_id,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const payload = formData.password
          ? formData
          : { name: formData.name, mobile: formData.mobile, role_id: formData.role_id };
        await updateUser({ id: editingUser.id, payload }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save user:", err);
      toast.error(err?.data?.message || "Failed to save user. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      toast.error(err?.data?.message || "Failed to delete user. Please try again.");
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
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

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
            <UsersIcon className="h-8 w-8" />
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system users and their roles
          </p>
        </div>
        {!showForm && (
          <PermissionGuard resource="user" action="create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
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
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      placeholder="e.g., 01712345678"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password {editingUser && "(leave blank to keep current)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter password"
                      required={!editingUser}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role_id">Role *</Label>
                    <Select
                      value={formData.role_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role_id: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="min-w-[100px]"
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingUser ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UsersIcon className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No users found. Add your first user to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: TUserWithRole, index: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {user.role.permissions?.length || 0} permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <PermissionGuard resource="user" action="update">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                          <PermissionGuard resource="user" action="delete">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(user.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
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
