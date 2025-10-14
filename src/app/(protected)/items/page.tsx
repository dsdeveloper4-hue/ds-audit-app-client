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
import { Plus, Edit2, Trash2, X, Loader2, Package } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TItem, TCreateItemPayload } from "@/types";
import { toast } from "sonner";

export default function ItemsPage() {
  const { data, isLoading, error } = useGetAllItemsQuery();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [formData, setFormData] = useState<TCreateItemPayload>({
    name: "",
    category: "",
    unit: "",
    description: "",
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const items = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      description: "",
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: TItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      description: item.description || "",
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
      toast.error(err?.data?.message || "Failed to save item. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(id).unwrap();
      toast.success("Item deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      toast.error(err?.data?.message || "Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Items
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage inventory items and their categories
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Laptop, Chair, Desk"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Electronics, Furniture"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="e.g., pieces, kg, liters"
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
                disabled={isCreating || isUpdating}
                className="min-w-[100px]"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
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
      )}

      {/* Items Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No items found. Add your first item to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: TItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <span className="truncate max-w-xs block">
                        {item.description || "—"}
                      </span>
                    </TableCell>
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
