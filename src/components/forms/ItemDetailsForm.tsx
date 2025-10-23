"use client";

import { useState, useMemo, FormEvent, useEffect } from "react";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import {
  useCreateItemDetailDirectMutation,
  useUpdateItemDetailDirectMutation,
} from "@/redux/features/itemDetails/itemDetailsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormWrapper } from "@/components/shared/FormWrapper";
import {
  TItemDetail,
  TCreateItemDetailPayload,
  TUpdateItemDetailPayload,
} from "@/types";
import { toast } from "sonner";

// Helper function to extract error message from RTK Query errors
const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return 'Unknown error occurred';

  // Handle SerializedError (has message property)
  if ('message' in error && error.message) {
    return error.message;
  }

  // Handle FetchBaseQueryError
  if ('status' in error) {
    // Network errors or server errors
    if (typeof error.status === 'string') {
      return error.status;
    }

    // HTTP errors
    if (typeof error.status === 'number') {
      if (error.data && typeof error.data === 'object' && 'message' in error.data) {
        return (error.data as any).message || `HTTP ${error.status} error`;
      }
      return `HTTP ${error.status} error`;
    }
  }

  return 'Unknown error occurred';
};

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
  const { data: itemsData, isLoading: isLoadingItems, error: itemsError } = useGetAllItemsQuery();
  const [createItemDetail, { isLoading: isCreating }] =
    useCreateItemDetailDirectMutation();
  const [updateItemDetail, { isLoading: isUpdating }] =
    useUpdateItemDetailDirectMutation();

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [formData, setFormData] = useState<
    TCreateItemDetailPayload & { item_id: string }
  >({
    room_id: roomId,
    item_id: itemDetail?.item_id || "",
    active_quantity: itemDetail?.active_quantity || 0,
    broken_quantity: itemDetail?.broken_quantity || 0,
    inactive_quantity: itemDetail?.inactive_quantity || 0,
  });

  // Sync form data with itemDetail prop changes
  useEffect(() => {
    if (itemDetail) {
      setFormData({
        room_id: roomId,
        item_id: itemDetail.item_id,
        active_quantity: itemDetail.active_quantity,
        broken_quantity: itemDetail.broken_quantity,
        inactive_quantity: itemDetail.inactive_quantity,
      });
      // Close popover when editing
      setOpen(false);
      setSearchValue("");
    } else {
      // Reset form when switching to create mode
      setFormData({
        room_id: roomId,
        item_id: "",
        active_quantity: 0,
        broken_quantity: 0,
        inactive_quantity: 0,
      });
      setOpen(false);
      setSearchValue("");
    }
  }, [itemDetail, roomId]);

  const items = itemsData?.data || [];
  const isLoading = isCreating || isUpdating || isLoadingItems;
  const isEditing = !!itemDetail;

  // ✅ Filter available items (excluding existing ones if creating)
  const availableItems = items
    .filter((item) =>
      isEditing
        ? item.id === itemDetail?.item_id
        : !existingItemIds.includes(item.id)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Get selected item for display
  const selectedItem = availableItems.find(
    (item) => item.id === formData.item_id
  );

  // ✅ Reactive filtering based on search value
  const filteredItems = useMemo(() => {
    const result = availableItems.filter((item) => {
      const term = searchValue.trim().toLowerCase();
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        (item.category?.toLowerCase() || "").includes(term)
      );
    });



    return result;
  }, [availableItems, searchValue]);

  const handleSelectItem = (value: string) => {
    setFormData((prev) => ({ ...prev, item_id: value }));
    setOpen(false);
    setSearchValue("");
  };

  const handleSubmit = async (e: FormEvent) => {
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

        await updateItemDetail({
          id: itemDetail!.id,
          payload: updatePayload,
        }).unwrap();
        toast.success("Item detail updated successfully!");
      } else {
        const createPayload = {
          ...formData,
          audit_id: auditId,
        };
        await createItemDetail(createPayload).unwrap();
        toast.success("Item detail created successfully!");
      }

      // onSuccess?.();
      // onClose();

    } catch (error: any) {
      console.error("Failed to save item detail:", error);
      toast.error(
        getErrorMessage(error) ||
          `Failed to ${
            isEditing ? "update" : "create"
          } item detail. Please try again.`
      );
    }
  };

  return (
    <FormWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Item Detail" : "Add New Item Detail"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={isEditing ? "Update" : "Create"}
    >
      {/* Item Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="item_id">Item *</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={isEditing}
              >
                {selectedItem ? (
                  <div className="flex items-center gap-2">
                    <span>{selectedItem.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedItem.category || "No Category"}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Select an item...
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search items..."
                  value={searchValue}
                  onValueChange={(value) => {
                    setSearchValue(value);
                  }}
                />
                <CommandEmpty>
                  {searchValue ? `No items found for &quot;${searchValue}&quot;` : "No items found."}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelectItem(item.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.item_id === item.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.category || "No Category"}
                        </Badge>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Quantities */}
        <div className="space-y-2">
          <Label htmlFor="active_quantity">Active Quantity</Label>
          <Input
            id="active_quantity"
            type="number"
            min="0"
            value={formData.active_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                active_quantity: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="broken_quantity">Broken Quantity</Label>
          <Input
            id="broken_quantity"
            type="number"
            min="0"
            value={formData.broken_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                broken_quantity: parseInt(e.target.value) || 0,
              })
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
              setFormData({
                ...formData,
                inactive_quantity: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>
      </div>

      {/* Loading state for items */}
      {isLoadingItems && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-4">
          <div className="flex gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Loading items...</strong>
            </p>
          </div>
        </div>
      )}

      {/* Error state for items */}
      {itemsError && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-4 mt-4">
          <div className="flex gap-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error loading items:</strong> {getErrorMessage(itemsError)}
            </p>
          </div>
        </div>
      )}

      {/* Debug Section */}
      {/* {!isLoading && !isLoadingItems && !itemsError && itemsData && (
        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 mt-4">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            <strong>Debug:</strong> {items.length} total items,{" "}
            {availableItems.length} available, {filteredItems.length} filtered
            {searchValue && (
              <span className="text-blue-600 ml-2">
                (search: &quot;{searchValue}&quot;)
              </span>
            )}
            {items.length > 0 && availableItems.length === 0 && !isEditing && (
              <span className="text-yellow-600 ml-2">
                (All items filtered out by existingItemIds: {existingItemIds.length} items excluded)
              </span>
            )}
          </p>
        </div>
      )} */}
    </FormWrapper>
  );
}
