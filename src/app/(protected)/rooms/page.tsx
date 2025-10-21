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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Loader2, DoorOpen } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TRoom, TCreateRoomPayload } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import { RoomList } from "@/components/shared/AllRooms";

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

  // Floor options
  const floorOptions = [
    { value: "1st Floor", label: "1st Floor" },
    { value: "2nd Floor", label: "2nd Floor" },
    { value: "3rd Floor", label: "3rd Floor" },
    { value: "4th Floor", label: "4th Floor" },
    { value: "5th Floor", label: "5th Floor" },
    { value: "6th Floor", label: "6th Floor" },
    { value: "7th Floor", label: "7th Floor" },
    { value: "8th Floor", label: "8th Floor" },
    { value: "9th Floor", label: "9th Floor" },
    { value: "10th Floor", label: "10th Floor" },
    { value: "custom", label: "Custom Floor" },
  ];
  const departmentOptions = [
    { value: "IT", label: "IT" },
    { value: "R&D", label: "R&D" },
    { value: "HR", label: "Human Resources" },
    { value: "Marketing", label: "Marketing" },
    { value: "Logistics", label: "Logistics" },
    { value: "Courier", label: "Courier" },
    { value: "Sales", label: "Sales" },
    { value: "Operations", label: "Operations" },
    { value: "Legal", label: "Legal" },
    { value: "Admin", label: "Administration" },
    { value: "Finance", label: "Finance" },
    { value: "custom", label: "Custom Department" },
  ];
  const [customFloor, setCustomFloor] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");

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
    setCustomFloor("");
    setCustomDepartment("");
  };

  const handleEdit = (room: TRoom) => {
    if (!canManageUsers) return;
    setEditingRoom(room);

    // Check if floor is in predefined options
    const floorInOptions = floorOptions.find((opt) => opt.value === room.floor);
    if (floorInOptions) {
      setFormData({
        name: room.name,
        floor: room.floor,
        department: "",
      });
      setCustomFloor("");
    } else {
      setFormData({
        name: room.name,
        floor: "custom",
        department: "",
      });
      setCustomFloor(room.floor || "");
    }

    // Check if department is in predefined options
    const deptInOptions = departmentOptions.find(
      (opt) => opt.value === room.department
    );
    if (deptInOptions) {
      setFormData((prev) => ({
        ...prev,
        department: room.department || "",
      }));
      setCustomDepartment("");
    } else {
      setFormData((prev) => ({
        ...prev,
        department: "custom",
      }));
      setCustomDepartment(room.department || "");
    }

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the final form data
    const submitData = {
      ...formData,
      floor: formData.floor === "custom" ? customFloor : formData.floor,
      department:
        formData.department === "custom"
          ? customDepartment
          : formData.department,
    };

    try {
      if (editingRoom) {
        await updateRoom({ id: editingRoom.id, payload: submitData }).unwrap();
        toast.success("Room updated successfully!");
      } else {
        await createRoom(submitData).unwrap();
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
    try {
      await deleteRoom(id).unwrap();
      toast.success("Room deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete room:", err);
      toast.error(
        err?.data?.message || "Failed to delete room. Please try again."
      );
    }
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
                    <div className="space-y-2">
                      <Select
                        value={formData.floor}
                        onValueChange={(value) =>
                          setFormData({ ...formData, floor: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorOptions.map((floor) => (
                            <SelectItem key={floor.value} value={floor.value}>
                              {floor.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.floor === "custom" && (
                        <Input
                          value={customFloor}
                          onChange={(e) => setCustomFloor(e.target.value)}
                          placeholder="Enter custom floor"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="space-y-2">
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          setFormData({ ...formData, department: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.department === "custom" && (
                        <Input
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                          placeholder="Enter custom department"
                        />
                      )}
                    </div>
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
    </motion.div>
  );
}
