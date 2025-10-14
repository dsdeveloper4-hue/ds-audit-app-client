"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateAuditMutation } from "@/redux/features/audit/auditApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateAuditPage() {
  const router = useRouter();
  const [createAudit, { isLoading }] = useCreateAuditMutation();

  const currentDate = new Date();
  const [formData, setFormData] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createAudit(formData).unwrap();
      toast.success(`Audit created successfully with ${result.data.totalRecords} records!`);
      router.push(`/audits/${result.data.audit.id}`);
    } catch (error: any) {
      console.error("Failed to create audit:", error);
      toast.error(error?.data?.message || "Failed to create audit. Please try again.");
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

  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Audit
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new audit for a specific month and year
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Month */}
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <select
                id="month"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                required
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
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
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Audit"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Creating an audit will automatically generate
              audit records for all existing inventory items. You can then update
              each record during the audit process.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
