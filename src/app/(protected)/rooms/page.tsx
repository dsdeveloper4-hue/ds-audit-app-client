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
import { Plus, X, Loader2, DoorOpen } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TRoom, TCreateRoomPayload } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import { RoomList } from "@/components/shared/AllRooms";
import { useConfirmationDialog } from "@/components/shared/ConfirmationDialog";

export default function RoomsPage() {
  const { canManageUsers } = useRole();
  const { data, isLoading, error } = useGetAllRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<TRoom | null>(null);
  const [formData, setFormData] = useState<TCreateRoomPayload>({
    name: "",
    floor: "",
    department: "",
  });

  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const rooms = data?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      floor: "",
      department: "",
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleEdit = (room: TRoom) => {
    if (!canManageUsers) return;
    setEditingRoom(room);
    setFormData({
      name: room.name,
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
      toast.error(
        err?.data?.message || "Failed to save room. Please try again."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!canManageUsers) return;
    const room = rooms.find(r => r.id === id);
    await confirm({
      title: "Delete Room",
      description: `Are you sure you want to delete "${room?.name || 'this room'}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteRoom(id).unwrap();
          toast.success("Room deleted successfully!");
        } catch (err: any) {
          console.error("Failed to delete room:", err);
          toast.error(
            err?.data?.message || "Failed to delete room. Please try again."
          );
        }
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DoorOpen className="h-8 w-8" />
            Rooms
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage room locations for inventory
          </p>
        </div>
        {!showForm && canManageUsers && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* inputs */}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Room List */}
      <motion.div variants={itemVariants}>
        <RoomList
          rooms={rooms}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canManageUsers={canManageUsers}
        />
      </motion.div>

      {ConfirmationDialog}
    </motion.div>
  );
}
