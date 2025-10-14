"use client";

import { useState } from "react";
import {
  useGetAllInventoriesQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from "@/redux/features/inventory/inventoryApi";
import { useGetAllRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
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
import { Plus, Edit2, Trash2, X, Loader2, Warehouse, Building, Package } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TInventory, TCreateInventoryPayload } from "@/types";
import { toast } from "sonner";

export default function InventoryPage() {
  const { data, isLoading, error } = useGetAllInventoriesQuery();
  const { data: roomsData } = useGetAllRoomsQuery();
  const { data: itemsData } = useGetAllItemsQuery();
  const [createInventory, { isLoading: isCreating }] = useCreateInventoryMutation();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingInventory, setEditingInventory] = useState<TInventory | null>(null);
  const [formData, setFormData] = useState<TCreateInventoryPayload>({
    room_id: "",
    item_id: "",
    current_quantity: 0,
    active_quantity: 0,
    broken_quantity: 0,
    inactive_quantity: 0,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const inventories = data?.data || [];
  const rooms = roomsData?.data || [];
  const items = itemsData?.data || [];

  const resetForm = () => {
    setFormData({
      room_id: "",
      item_id: "",
      current_quantity: 0,
      active_quantity: 0,
      broken_quantity: 0,
      inactive_quantity: 0,
    });
    setEditingInventory(null);
    setShowForm(false);
  };

  const handleEdit = (inventory: TInventory) => {
    setEditingInventory(inventory);
    setFormData({
      room_id: inventory.room_id,
      item_id: inventory.item_id,
      current_quantity: inventory.current_quantity,
      active_quantity: inventory.active_quantity,
      broken_quantity: inventory.broken_quantity,
      inactive_quantity: inventory.inactive_quantity,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingInventory) {
        const { room_id, item_id, ...updatePayload } = formData;
        await updateInventory({ id: editingInventory.id, payload: updatePayload }).unwrap();
        toast.success("Inventory updated successfully!");
      } else {
        await createInventory(formData).unwrap();
        toast.success("Inventory created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save inventory:", err);
      toast.error(err?.data?.message || "Failed to save inventory. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory record?")) return;

    try {
      await deleteInventory(id).unwrap();
      toast.success("Inventory deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete inventory:", err);
      toast.error(err?.data?.message || "Failed to delete inventory. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage inventory quantities for each room and item
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingInventory ? "Edit Inventory" : "Add New Inventory"}
            </h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_id">Room *</Label>
                <select
                  id="room_id"
                  value={formData.room_id}
                  onChange={(e) =>
                    setFormData({ ...formData, room_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  required
                  disabled={!!editingInventory}
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item_id">Item *</Label>
                <select
                  id="item_id"
                  value={formData.item_id}
                  onChange={(e) =>
                    setFormData({ ...formData, item_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  required
                  disabled={!!editingInventory}
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="active_quantity">Active Quantity</Label>
                <Input
                  id="active_quantity"
                  type="number"
                  min="0"
                  value={formData.active_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, active_quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="broken_quantity">Broken Quantity</Label>
                <Input
                  id="broken_quantity"
                  type="number"
                  min="0"
                  value={formData.broken_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, broken_quantity: Number(e.target.value) })
                  }
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
                    setFormData({ ...formData, inactive_quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_quantity">Total Quantity</Label>
                <Input
                  id="current_quantity"
                  type="number"
                  min="0"
                  value={formData.current_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, current_quantity: Number(e.target.value) })
                  }
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
                ) : editingInventory ? (
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

      {/* Inventory Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Broken</TableHead>
                <TableHead className="text-center">Inactive</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Warehouse className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No inventory records found. Add your first inventory to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                inventories.map((inventory: TInventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {inventory.room?.name || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        {inventory.item?.name || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {inventory.item?.category || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {inventory.active_quantity}
                    </TableCell>
                    <TableCell className="text-center text-red-600 dark:text-red-400">
                      {inventory.broken_quantity}
                    </TableCell>
                    <TableCell className="text-center text-gray-500">
                      {inventory.inactive_quantity}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {inventory.current_quantity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(inventory)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(inventory.id)}
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
