"use client";

import { useState } from "react";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import {
  useCreateItemDetailDirectMutation,
  useUpdateItemDetailDirectMutation,
} from "@/redux/features/itemDetails/itemDetailsApi";
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
import { FormWrapper } from "@/components/shared/FormWrapper";
import { TItemDetail, TCreateItemDetailPayload, TUpdateItemDetailPayload } from "@/types";
import { toast } from "sonner";

interface ItemDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  itemDetail?: TItemDetail;
  auditId: string;
  roomId: string;
  existingItemIds?: string[];
  onSuccess?: () => void;
}

export function ItemDetailsForm({
  isOpen,
  onClose,
  itemDetail,
  auditId,
  roomId,
  existingItemIds = [],
  onSuccess,
}: ItemDetailsFormProps) {
  const { data: itemsData } = useGetAllItemsQuery();
  const [createItemDetail, { isLoading: isCreating }] = useCreateItemDetailDirectMutation();
  const [updateItemDetail, { isLoading: isUpdating }] = useUpdateItemDetailDirectMutation();

  const [formData, setFormData] = useState<TCreateItemDetailPayload & { item_id: string }>({
    room_id: roomId,
    item_id: itemDetail?.item_id || "",
    active_quantity: itemDetail?.active_quantity || 0,
    broken_quantity: itemDetail?.broken_quantity || 0,
    inactive_quantity: itemDetail?.inactive_quantity || 0,
  });

  const items = itemsData?.data || [];
  const isLoading = isCreating || isUpdating;
  const isEditing = !!itemDetail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_id) {
      toast.error("Please select an item");
      return;
    }

    try {
      if (isEditing) {
        const updatePayload: TUpdateItemDetailPayload = {
          active_quantity: formData.active_quantity,
          broken_quantity: formData.broken_quantity,
          inactive_quantity: formData.inactive_quantity,
        };
        await updateItemDetail({ id: itemDetail.id, payload: updatePayload }).unwrap();
        toast.success("Item detail updated successfully!");
      } else {
        const createPayload = {
          ...formData,
          audit_id: auditId,
        };
        await createItemDetail(createPayload).unwrap();
        toast.success("Item detail created successfully!");
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to save item detail:", error);
      toast.error(
        error?.data?.message || `Failed to ${isEditing ? "update" : "create"} item detail. Please try again.`
      );
    }
  };

  const availableItems = items.filter(item => 
    isEditing ? item.id === itemDetail?.item_id : !existingItemIds.includes(item.id)
  );

  return (
    <FormWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Item Detail" : "Add New Item Detail"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={isEditing ? "Update" : "Create"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="item_id">Item *</Label>
          <Select
            value={formData.item_id}
            onValueChange={(value) =>
              setFormData({ ...formData, item_id: value })
            }
            disabled={isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              {availableItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="active_quantity">Active Quantity</Label>
          <Input
            id="active_quantity"
            type="number"
            min="0"
            value={formData.active_quantity}
            onChange={(e) =>
              setFormData({ ...formData, active_quantity: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="broken_quantity">Broken Quantity</Label>
          <Input
            id="broken_quantity"
            type="number"
            min="0"
            value={formData.broken_quantity}
            onChange={(e) =>
              setFormData({ ...formData, broken_quantity: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inactive_quantity">Inactive Quantity</Label>
          <Input
            id="inactive_quantity"
            type="number"
            min="0"
            value={formData.inactive_quantity}
            onChange={(e) =>
              setFormData({ ...formData, inactive_quantity: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />
        </div>
      </div>

      {!isEditing && availableItems.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <div className="flex gap-3">
            <div className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5">
              ⚠️
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> All available items have already been added to this room for this audit.
            </p>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
