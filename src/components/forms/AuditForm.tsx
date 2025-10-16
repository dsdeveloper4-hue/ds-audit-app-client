"use client";

import { useState } from "react";
import { useCreateAuditMutation, useUpdateAuditMutation } from "@/redux/features/audit/auditApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormWrapper } from "@/components/shared/FormWrapper";
import { TAudit, TCreateAuditPayload, TUpdateAuditPayload } from "@/types";
import { toast } from "sonner";

interface AuditFormProps {
  isOpen: boolean;
  onClose: () => void;
  audit?: TAudit;
  onSuccess?: () => void;
}

export function AuditForm({ isOpen, onClose, audit, onSuccess }: AuditFormProps) {
  const [createAudit, { isLoading: isCreating }] = useCreateAuditMutation();
  const [updateAudit, { isLoading: isUpdating }] = useUpdateAuditMutation();

  const currentDate = new Date();
  const [formData, setFormData] = useState<TCreateAuditPayload>({
    month: audit?.month || currentDate.getMonth() + 1,
    year: audit?.year || currentDate.getFullYear(),
    notes: audit?.notes || "",
  });

  const isLoading = isCreating || isUpdating;
  const isEditing = !!audit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const updatePayload: TUpdateAuditPayload = {
          notes: formData.notes,
        };
        await updateAudit({ id: audit.id, payload: updatePayload }).unwrap();
        toast.success("Audit updated successfully!");
      } else {
        await createAudit(formData).unwrap();
        toast.success("Audit created successfully!");
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to save audit:", error);
      toast.error(
        error?.data?.message || `Failed to ${isEditing ? "update" : "create"} audit. Please try again.`
      );
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  return (
    <FormWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Audit" : "Create New Audit"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={isEditing ? "Update" : "Create"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="month">Month *</Label>
          <Select
            value={formData.month.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, month: Number(value) })
            }
            disabled={isEditing} // Don't allow changing month/year for existing audits
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select
            value={formData.year.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, year: Number(value) })
            }
            disabled={isEditing} // Don't allow changing month/year for existing audits
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Add any notes about this audit..."
          rows={4}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      {!isEditing && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex gap-3">
            <div className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
              ℹ️
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Creating an audit will automatically
              generate item details for all existing rooms and items. You
              can then add quantities during the audit process.
            </p>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
