"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { TCreateItemPayload, TItem } from "@/types";

interface ItemFormProps {
  /** When editing an existing item */
  initialData?: TItem | null;
  /** Loading state (e.g., while creating or updating) */
  loading?: boolean;
  /** Called when the form is submitted */
  onSubmit: (data: TCreateItemPayload) => Promise<void> | void;
  /** Called when the form is closed or canceled */
  onCancel?: () => void;
}

/**
 * Reusable Item Form Component
 * Handles both create and edit modes
 */
export default function ItemForm({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const [formData, setFormData] = useState<TCreateItemPayload>({
    name: initialData?.name || "",
    category: initialData?.category || "",
    unit: initialData?.unit || "",
  });

  const isEditing = Boolean(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.unit.trim()
    )
      return;
    await onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 overflow-hidden shadow-md border border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h2>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Form */}
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
