"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TItem, TCreateItemPayload } from "@/types";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from "@/redux/features/item/itemApi";

type ItemFormProps = {
  editingItem?: TItem | null;
  onClose: () => void;
};

export default function ItemForm({ editingItem, onClose }: ItemFormProps) {
  const [formData, setFormData] = useState<TCreateItemPayload>({
    name: editingItem?.name || "",
    category: editingItem?.category || "",
    unit: editingItem?.unit || "",
    description: editingItem?.description || "",
  });

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

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
      onClose();
    } catch (err: any) {
      console.error("Failed to save item:", err);
      toast.error(
        err?.data?.message || "Failed to save item. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editingItem ? "Edit Item" : "Add New Item"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
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
              onClick={onClose}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
