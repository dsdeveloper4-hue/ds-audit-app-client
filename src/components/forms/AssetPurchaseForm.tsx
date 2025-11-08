"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAssetPurchaseMutation,
  useUpdateAssetPurchaseMutation,
} from "@/redux/features/assetPurchase/assetPurchaseApi";
import { useCreateItemMutation } from "@/redux/features/item/itemApi";
import { TAssetPurchase, TRoom, TItem } from "@/types";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const assetPurchaseSchema = z.object({
  room_id: z.string().min(1, "Room is required"),
  item_id: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Unit price cannot be negative"),
  purchase_date: z.string().optional(),
  notes: z.string().optional(),
});

type AssetPurchaseFormData = z.infer<typeof assetPurchaseSchema>;

interface AssetPurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchase?: TAssetPurchase;
  rooms: TRoom[];
  items: TItem[];
  onSuccess?: () => void;
}

export function AssetPurchaseForm({
  isOpen,
  onClose,
  purchase,
  rooms,
  items,
  onSuccess,
}: AssetPurchaseFormProps) {
  const [createAssetPurchase, { isLoading: isCreating }] =
    useCreateAssetPurchaseMutation();
  const [updateAssetPurchase, { isLoading: isUpdating }] =
    useUpdateAssetPurchaseMutation();
  const [createItem, { isLoading: isCreatingItem }] = useCreateItemMutation();

  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [localItems, setLocalItems] = useState<TItem[]>(items);

  // Category options - same as ItemForm plus "Review Unite"
  const categoryOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Books", label: "Books" },
    { value: "Clothing", label: "Clothing" },
    { value: "Tools", label: "Tools" },
    { value: "Vehicles", label: "Vehicles" },
    { value: "Equipment", label: "Equipment" },
    { value: "Review Unite", label: "Review Unite" },
    { value: "custom", label: "Custom Category" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AssetPurchaseFormData>({
    resolver: zodResolver(assetPurchaseSchema),
    defaultValues: {
      room_id: "",
      item_id: "",
      quantity: 1,
      unit_price: 0,
      purchase_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const quantity = watch("quantity");
  const unitPrice = watch("unit_price");
  const totalCost = (quantity || 0) * (unitPrice || 0);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    if (purchase) {
      setValue("room_id", purchase.room_id);
      setValue("item_id", purchase.item_id);
      setValue("quantity", purchase.quantity);
      setValue("unit_price", purchase.unit_price);
      setValue(
        "purchase_date",
        new Date(purchase.purchase_date).toISOString().split("T")[0]
      );
      setValue("notes", purchase.notes || "");
    } else {
      reset({
        room_id: "",
        item_id: "",
        quantity: 1,
        unit_price: 0,
        purchase_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [purchase, setValue, reset]);

  const handleAddNewItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    try {
      // Determine the final category value
      const finalCategory =
        newItemCategory === "custom" ? customCategory.trim() : newItemCategory;

      const result = await createItem({
        name: newItemName.trim(),
        category: finalCategory || undefined,
      }).unwrap();
      const newItem = result.data;

      setLocalItems([...localItems, newItem]);
      setValue("item_id", newItem.id);
      setNewItemName("");
      setNewItemCategory("");
      setCustomCategory("");
      setShowNewItemInput(false);
      toast.success("Item added successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add item");
    }
  };

  const onSubmit = async (data: AssetPurchaseFormData) => {
    try {
      if (purchase) {
        await updateAssetPurchase({
          id: purchase.id,
          payload: data,
        }).unwrap();
        toast.success("Asset purchase updated successfully!");
      } else {
        await createAssetPurchase(data).unwrap();
        toast.success("Asset purchase added successfully!");
      }
      onSuccess?.();
      onClose();
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save asset purchase");
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setShowNewItemInput(false);
    setNewItemName("");
    setNewItemCategory("");
    setCustomCategory("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {purchase ? "Edit Asset Purchase" : "Add Asset Purchase"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="room_id">
              Room <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("room_id")}
              onValueChange={(value) => setValue("room_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                    {room.floor && ` - Floor ${room.floor}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.room_id && (
              <p className="text-sm text-red-500">{errors.room_id.message}</p>
            )}
          </div>

          {/* Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="item_id">
              Item <span className="text-red-500">*</span>
            </Label>
            {!showNewItemInput ? (
              <div className="flex gap-2">
                <Combobox
                  options={localItems.map((item) => ({
                    value: item.id,
                    label: item.name,
                    subtitle: item.category,
                  }))}
                  value={watch("item_id")}
                  onValueChange={(value) => setValue("item_id", value)}
                  placeholder="Select an item"
                  searchPlaceholder="Search items..."
                  emptyText="No items found."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewItemInput(true)}
                  title="Add new item"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="space-y-2">
                  <Label htmlFor="new_item_name">Item Name</Label>
                  <Input
                    id="new_item_name"
                    placeholder="Enter new item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewItem();
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_item_category">Category (Optional)</Label>
                  <Select
                    value={newItemCategory}
                    onValueChange={(value) => {
                      setNewItemCategory(value);
                      if (value !== "custom") {
                        setCustomCategory("");
                      }
                    }}
                  >
                    <SelectTrigger id="new_item_category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newItemCategory === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom_category">Custom Category</Label>
                    <Input
                      id="custom_category"
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddNewItem}
                    disabled={isCreatingItem}
                    className="flex-1"
                  >
                    {isCreatingItem ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewItemInput(false);
                      setNewItemName("");
                      setNewItemCategory("");
                      setCustomCategory("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {errors.item_id && (
              <p className="text-sm text-red-500">{errors.item_id.message}</p>
            )}
          </div>

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">
                Unit Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                {...register("unit_price", { valueAsNumber: true })}
              />
              {errors.unit_price && (
                <p className="text-sm text-red-500">
                  {errors.unit_price.message}
                </p>
              )}
            </div>
          </div>

          {/* Total Cost Display */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Cost:
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ৳{totalCost.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {quantity} × ৳{unitPrice.toFixed(2)}
            </p>
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register("purchase_date")}
            />
            {errors.purchase_date && (
              <p className="text-sm text-red-500">
                {errors.purchase_date.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              rows={3}
              {...register("notes")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {purchase ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{purchase ? "Update Purchase" : "Add Purchase"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
