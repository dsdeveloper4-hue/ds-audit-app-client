"use client";

import { useState } from "react";
import {
  useGetAllRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "@/redux/features/room/roomApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, X, Loader2, Building } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { TRoom, TCreateRoomPayload } from "@/types";
import { toast } from "sonner";

export default function RoomsPage() {
  const { data, isLoading, error } = useGetAllRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<TRoom | null>(null);
  const [formData, setFormData] = useState<TCreateRoomPayload>({
    name: "",
    description: "",
    floor: "",
    department: "",
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const rooms = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      floor: "",
      department: "",
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleEdit = (room: TRoom) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || "",
      floor: room.floor || "",
      department: room.department || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRoom) {
        await updateRoom({ id: editingRoom.id, payload: formData }).unwrap();
        toast.success("Room updated successfully!");
      } else {
        await createRoom(formData).unwrap();
        toast.success("Room created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save room:", err);
      toast.error(err?.data?.message || "Failed to save room. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoom(id).unwrap();
      toast.success("Room deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete room:", err);
      toast.error(err?.data?.message || "Failed to delete room. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rooms
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage room locations for inventory
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Conference Room A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  placeholder="e.g., 1st Floor"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g., IT Department"
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
                ) : editingRoom ? (
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

      {/* Rooms Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No rooms found. Add your first room to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room: TRoom) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.floor || "—"}</TableCell>
                    <TableCell>{room.department || "—"}</TableCell>
                    <TableCell>
                      <span className="truncate max-w-xs block">
                        {room.description || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(room.id)}
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
