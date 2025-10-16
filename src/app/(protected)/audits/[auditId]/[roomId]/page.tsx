"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetAllItemsQuery,
} from "@/redux/features/item/itemApi";
import {
  useGetRoomByIdQuery,
} from "@/redux/features/room/roomApi";
import {
  useGetAuditByIdQuery,
} from "@/redux/features/audit/auditApi";
import {
  useGetAllItemDetailsQuery,
  useCreateItemDetailDirectMutation,
  useUpdateItemDetailDirectMutation,
  useDeleteItemDetailDirectMutation,
} from "@/redux/features/itemDetails/itemDetailsApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, X, Loader2, Package, ArrowLeft, Building, Calendar } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { TItemDetail, TCreateItemDetailPayload, TUpdateItemDetailPayload } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import Link from "next/link";

export default function ItemDetailsPage() {
  const { canManageUsers } = useRole();
  const params = useParams();
  const auditId = params.auditId as string;
  const roomId = params.roomId as string;

  // API queries
  const { data: itemsData, isLoading: itemsLoading } = useGetAllItemsQuery();
  const { data: roomData, isLoading: roomLoading } = useGetRoomByIdQuery(roomId);
  const { data: auditData, isLoading: auditLoading } = useGetAuditByIdQuery(auditId);
  const { data: itemDetailsData, isLoading: itemDetailsLoading, error } = useGetAllItemDetailsQuery();
  
  // API mutations
  const [createItemDetail, { isLoading: isCreating }] = useCreateItemDetailDirectMutation();
  const [updateItemDetail, { isLoading: isUpdating }] = useUpdateItemDetailDirectMutation();
  const [deleteItemDetail, { isLoading: isDeleting }] = useDeleteItemDetailDirectMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingItemDetail, setEditingItemDetail] = useState<TItemDetail | null>(null);
  const [formData, setFormData] = useState<TCreateItemDetailPayload & { item_id: string }>({
    room_id: roomId,
    item_id: "",
    active_quantity: 0,
    broken_quantity: 0,
    inactive_quantity: 0,
  });

  // Filter item details for current room and audit
  const filteredItemDetails = itemDetailsData?.data?.filter(
    (detail) => detail.room_id === roomId && detail.audit_id === auditId
  ) || [];

  const items = itemsData?.data || [];
  const room = roomData?.data;
  const audit = auditData?.data;

  if (itemsLoading || roomLoading || auditLoading || itemDetailsLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const resetForm = () => {
    setFormData({
      room_id: roomId,
      item_id: "",
      active_quantity: 0,
      broken_quantity: 0,
      inactive_quantity: 0,
    });
    setEditingItemDetail(null);
    setShowForm(false);
  };

  const handleEdit = (itemDetail: TItemDetail) => {
    setEditingItemDetail(itemDetail);
    setFormData({
      room_id: itemDetail.room_id,
      item_id: itemDetail.item_id,
      active_quantity: itemDetail.active_quantity,
      broken_quantity: itemDetail.broken_quantity,
      inactive_quantity: itemDetail.inactive_quantity,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_id) {
      toast.error("Please select an item");
      return;
    }

    try {
      if (editingItemDetail) {
        const updatePayload: TUpdateItemDetailPayload = {
          active_quantity: formData.active_quantity,
          broken_quantity: formData.broken_quantity,
          inactive_quantity: formData.inactive_quantity,
        };
        await updateItemDetail({ id: editingItemDetail.id, payload: updatePayload }).unwrap();
        toast.success("Item detail updated successfully!");
      } else {
        const createPayload = {
          ...formData,
          audit_id: auditId,
        };
        await createItemDetail(createPayload).unwrap();
        toast.success("Item detail created successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error("Failed to save item detail:", err);
      toast.error(err?.data?.message || "Failed to save item detail. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item detail?")) return;

    try {
      await deleteItemDetail(id).unwrap();
      toast.success("Item detail deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete item detail:", err);
      toast.error(err?.data?.message || "Failed to delete item detail. Please try again.");
    }
  };

  const getTotalQuantity = (itemDetail: TItemDetail) => {
    return itemDetail.active_quantity + itemDetail.broken_quantity + itemDetail.inactive_quantity;
  };


  const isItemAlreadyAdded = (itemId: string) => {
    return filteredItemDetails.some(detail => detail.item_id === itemId);
  };

  const getStatistics = () => {
    const totalActive = filteredItemDetails.reduce((sum, detail) => sum + detail.active_quantity, 0);
    const totalBroken = filteredItemDetails.reduce((sum, detail) => sum + detail.broken_quantity, 0);
    const totalInactive = filteredItemDetails.reduce((sum, detail) => sum + detail.inactive_quantity, 0);
    const grandTotal = totalActive + totalBroken + totalInactive;
    
    return { totalActive, totalBroken, totalInactive, grandTotal };
  };

  const statistics = getStatistics();

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
  } as const ;

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
        className="space-y-4"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/audits" className="hover:text-gray-700 dark:hover:text-gray-300">
            Audits
          </Link>
          <span>/</span>
          <Link href={`/audits/${auditId}`} className="hover:text-gray-700 dark:hover:text-gray-300">
            {audit?.month} {audit?.year}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{room?.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="h-8 w-8" />
              Item Details
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{room?.name} - {room?.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{audit?.month} {audit?.year}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/audits/${auditId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Audit
              </Button>
            </Link>
            {!showForm && canManageUsers && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item Detail
                </Button>
              </motion.div>
            )}
          </div>
        </div>
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
                  {editingItemDetail ? "Edit Item Detail" : "Add New Item Detail"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item_id">Item *</Label>
                    <Select
                      value={formData.item_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, item_id: value })
                      }
                      disabled={!!editingItemDetail}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items
                          .filter(item => editingItemDetail?.item_id === item.id || !isItemAlreadyAdded(item.id))
                          .map((item) => (
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
                    ) : editingItemDetail ? (
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

      {/* Statistics Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Items</p>
                <p className="text-2xl font-bold text-green-600">{statistics.totalActive}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Broken Items</p>
                <p className="text-2xl font-bold text-red-600">{statistics.totalBroken}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive Items</p>
                <p className="text-2xl font-bold text-gray-600">{statistics.totalInactive}</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.grandTotal}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Item Details Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Item Details</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredItemDetails.length} item{filteredItemDetails.length !== 1 ? 's' : ''} tracked
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Broken</TableHead>
                  <TableHead className="text-center">Inactive</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItemDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No item details found for this room. Add your first item detail to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItemDetails.map((itemDetail: TItemDetail, index: number) => {
                    const item = items.find(i => i.id === itemDetail.item_id);
                    return (
                      <motion.tr
                        key={itemDetail.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <TableCell className="font-medium">
                          {item?.name || "Unknown Item"}
                        </TableCell>
                        <TableCell>
                          {item?.category && (
                            <Badge variant="secondary">{item.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {itemDetail.active_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {itemDetail.broken_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {itemDetail.inactive_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                            {getTotalQuantity(itemDetail)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {canManageUsers && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(itemDetail)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(itemDetail.id)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
