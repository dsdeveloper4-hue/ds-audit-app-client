"use client";

import { useState } from "react";
import {
  useGetAllItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "@/redux/features/item/itemApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, X, Loader2, Package } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TItem, TCreateItemPayload } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import ItemForm from "@/components/shared/ItemForm";

export default function ItemsPage() {
  const { canManageUsers } = useRole();
  const { data, isLoading, error } = useGetAllItemsQuery();
  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [formData, setFormData] = useState<TCreateItemPayload>({
    name: "",
    category: "",
    unit: "",
  });

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const items = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: TItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || "",
      unit: item.unit || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateItem({ id: editingItem.id, payload: formData }).unwrap();
        toast.success("Item updated successfully!");
      } else {
        await createItem(formData).unwrap();
        toast.success("Item created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save item:", err);
      toast.error(
        err?.data?.message || "Failed to save item. Please try again."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(id).unwrap();
      toast.success("Item deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      toast.error(
        err?.data?.message || "Failed to delete item. Please try again."
      );
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
            <Package className="h-8 w-8" />
            Items
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage inventory items and their categories
          </p>
        </div>
        {!showForm && canManageUsers && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <ItemForm
            editingItem={editingItem}
            onClose={() => {
              setEditingItem(null);
              setShowForm(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Items Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No items found. Add your first item to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item: TItem, index: number) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
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
