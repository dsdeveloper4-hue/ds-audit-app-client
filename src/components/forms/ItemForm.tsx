"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
export default function   ItemForm({
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

  const [customCategory, setCustomCategory] = useState("");
  const [customUnit, setCustomUnit] = useState("");

  // Category options
  const categoryOptions = useMemo(() => [
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Books", label: "Books" },
    { value: "Clothing", label: "Clothing" },
    { value: "Tools", label: "Tools" },
    { value: "Vehicles", label: "Vehicles" },
    { value: "Equipment", label: "Equipment" },
    { value: "custom", label: "Custom Category" },
  ], []);

  // Unit options
  const unitOptions = useMemo(() => [
    { value: "pieces", label: "Pieces" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "liters", label: "Liters" },
    { value: "meters", label: "Meters" },
    { value: "boxes", label: "Boxes" },
    { value: "sets", label: "Sets" },
    { value: "pairs", label: "Pairs" },
    { value: "units", label: "Units" },
    { value: "custom", label: "Custom Unit" },
  ], []);

  const isEditing = Boolean(initialData);

  // Initialize custom values for editing
  useEffect(() => {
    if (initialData) {
      // Check if category is in predefined options
      const categoryInOptions = categoryOptions.find((opt: { value: string; label: string }) => opt.value === initialData.category);
      if (categoryInOptions) {
        setFormData(prev => ({ ...prev, category: initialData.category || "" }));
        setCustomCategory("");
      } else {
        setFormData(prev => ({ ...prev, category: "custom" }));
        setCustomCategory(initialData.category || "");
      }

      // Check if unit is in predefined options
      const unitInOptions = unitOptions.find((opt: { value: string; label: string }) => opt.value === initialData.unit);
      if (unitInOptions) {
        setFormData(prev => ({ ...prev, unit: initialData.unit || "" }));
        setCustomUnit("");
      } else {
        setFormData(prev => ({ ...prev, unit: "custom" }));
        setCustomUnit(initialData.unit || "");
      }
    }
  }, [initialData, categoryOptions, unitOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Prepare the final form data
    const submitData = {
      ...formData,
      category: formData.category === "custom" ? customCategory : formData.category,
      unit: formData.unit === "custom" ? customUnit : formData.unit,
    };

    await onSubmit(submitData);
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
              <Label htmlFor="category">Category</Label>
              <div className="space-y-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category: { value: string; label: string }) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category === "custom" && (
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <div className="space-y-2">
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit: { value: string; label: string }) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.unit === "custom" && (
                  <Input
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    placeholder="Enter custom unit"
                  />
                )}
              </div>
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
