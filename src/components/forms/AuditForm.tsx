"use client";

import { useState } from "react";
import {
  useCreateAuditMutation,
  useUpdateAuditMutation,
} from "@/redux/features/audit/auditApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users } from "lucide-react";
import { FormWrapper } from "@/components/shared/FormWrapper";
import { TAudit, TCreateAuditPayload, TUpdateAuditPayload } from "@/types";
import { toast } from "sonner";
import months from "@/constants/months";

interface AuditFormProps {
  isOpen: boolean;
  onClose: () => void;
  audit?: TAudit;
  onSuccess?: () => void;
}

export function AuditForm({
  isOpen,
  onClose,
  audit,
  onSuccess,
}: AuditFormProps) {
  const [createAudit, { isLoading: isCreating }] = useCreateAuditMutation();
  const [updateAudit, { isLoading: isUpdating }] = useUpdateAuditMutation();
  const { data: usersData, isLoading: isLoadingUsers } =
    useGetAllUsersQuery(undefined);

  const isEditing = !!audit;
  const isLoading = isCreating || isUpdating;

  const currentDate = new Date();
  const [formData, setFormData] = useState<TCreateAuditPayload>({
    month: audit?.month || currentDate.getMonth() + 1,
    year: audit?.year || currentDate.getFullYear(),
    notes: audit?.notes || "",
    participant_ids: audit?.participants?.map((p) => p.id) || [],
  });

  const [status, setStatus] = useState<
    "IN_PROGRESS" | "COMPLETED" | "CANCELED"
  >(audit?.status || "IN_PROGRESS");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const updatePayload: TUpdateAuditPayload = {
          status: status,
          notes: formData.notes,
          participant_ids: formData.participant_ids,
        };
        await updateAudit({ id: audit.id, payload: updatePayload }).unwrap();
        toast.success("Audit updated successfully!");
      } else {
        // If no participants selected, use current user as participant
        const payload: TCreateAuditPayload = {
          ...formData,
          participant_ids:
            formData.participant_ids && formData.participant_ids.length > 0
              ? formData.participant_ids
              : [], // Let backend handle default participant logic
        };
        await createAudit(payload).unwrap();
        toast.success("Audit created successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to save audit:", error);
      toast.error(
        error?.data?.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } audit. Please try again.`
      );
    }
  };

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

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value: "IN_PROGRESS" | "COMPLETED" | "CANCELED") =>
              setStatus(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this audit..."
          rows={4}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="participants">Participants</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={false}
              className="w-full justify-between"
              disabled={isLoadingUsers}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {formData.participant_ids &&
                  formData.participant_ids.length > 0
                    ? `${formData.participant_ids.length} participant${
                        formData.participant_ids.length > 1 ? "s" : ""
                      } selected`
                    : "Select participants"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="p-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {usersData?.data?.map((user) => {
                  const isSelected =
                    formData.participant_ids?.includes(user.id) || false;
                  return (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked: boolean) => {
                          const newParticipants =
                            formData.participant_ids || [];
                          if (checked) {
                            setFormData({
                              ...formData,
                              participant_ids: [...newParticipants, user.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              participant_ids: newParticipants.filter(
                                (id) => id !== user.id
                              ),
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.mobile}
                          </span>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {formData.participant_ids && formData.participant_ids.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.participant_ids.map((participantId) => {
              const user = usersData?.data?.find((u) => u.id === participantId);
              return user ? (
                <div
                  key={participantId}
                  className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        participant_ids:
                          formData.participant_ids?.filter(
                            (id) => id !== participantId
                          ) || [],
                      });
                    }}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}

        {(!formData.participant_ids ||
          formData.participant_ids.length === 0) && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No participants selected. The audit creator will be automatically
            assigned as a participant.
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex gap-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Creating an audit will automatically
              generate item details for all existing rooms and items. You can
              then add quantities during the audit process.
            </p>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
