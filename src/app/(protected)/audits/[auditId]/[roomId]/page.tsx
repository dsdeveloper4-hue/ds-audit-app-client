"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetRoomByIdQuery } from "@/redux/features/room/roomApi";
import { useGetAuditByIdQuery } from "@/redux/features/audit/auditApi";
import {
  useGetAllItemDetailsQuery,
  useDeleteItemDetailDirectMutation,
} from "@/redux/features/itemDetails/itemDetailsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Trash2,
  Package,
  ArrowLeft,
  Building,
  Calendar,
} from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatisticsCards } from "@/components/shared/StatisticsCards";
import { useConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { ItemDetailsForm } from "@/components/forms/ItemDetailsForm";
import { TItemDetail } from "@/types";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import Link from "next/link";

export default function ItemDetailsPage() {
  const { canManageUsers } = useRole();
  const params = useParams();
  const auditId = params.auditId as string;
  const roomId = params.roomId as string;

  // API queries
  const { data: roomData, isLoading: roomLoading } =
    useGetRoomByIdQuery(roomId);
  const { data: auditData, isLoading: auditLoading } =
    useGetAuditByIdQuery(auditId);
  const {
    data: itemDetailsData,
    isLoading: itemDetailsLoading,
    error,
  } = useGetAllItemDetailsQuery();

  // API mutations
  const [deleteItemDetail] = useDeleteItemDetailDirectMutation();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const [showForm, setShowForm] = useState(false);
  const [editingItemDetail, setEditingItemDetail] =
    useState<TItemDetail | null>(null);

  // Filter item details for current room and audit
  const filteredItemDetails =
    itemDetailsData?.data?.filter(
      (detail) => detail.room_id === roomId && detail.audit_id === auditId
    ) || [];

  const room = roomData?.data;
  const audit = auditData?.data;

  if (roomLoading || auditLoading || itemDetailsLoading)
    return <ListPageSkeleton />;
  if (error) return <Error />;

  const handleCloseForm = () => {
    setEditingItemDetail(null);
    setShowForm(false);
  };

  const handleEdit = (itemDetail: TItemDetail) => {
    setEditingItemDetail(itemDetail);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItemDetail(null);
    setShowForm(true);
  };

  const handleDelete = (itemDetail: TItemDetail) => {
    const itemName = itemDetail.item?.name || "Unknown Item";
    confirm({
      title: "Delete Item Detail",
      description: `Are you sure you want to delete the details for "${itemName}"? This action cannot be undone.`,
      confirmText: "Delete Item Detail",
      variant: "destructive",
      onConfirm: async () => {
        await deleteItemDetail(itemDetail.id).unwrap();
        toast.success("Item detail deleted successfully!");
      },
    });
  };

  const getTotalQuantity = (itemDetail: TItemDetail) => {
    return (
      itemDetail.active_quantity +
      itemDetail.broken_quantity +
      itemDetail.inactive_quantity
    );
  };

  const existingItemIds = filteredItemDetails.map((detail) => detail.item_id);

  const statistics = {
    totalActive: filteredItemDetails.reduce(
      (sum, detail) => sum + detail.active_quantity,
      0
    ),
    totalBroken: filteredItemDetails.reduce(
      (sum, detail) => sum + detail.broken_quantity,
      0
    ),
    totalInactive: filteredItemDetails.reduce(
      (sum, detail) => sum + detail.inactive_quantity,
      0
    ),
    grandTotal: filteredItemDetails.reduce(
      (sum, detail) =>
        sum +
        (detail.active_quantity +
          detail.broken_quantity +
          detail.inactive_quantity),
      0
    ),
  };

  const statisticsCards = [
    {
      title: "Active Items",
      value: statistics.totalActive,
      icon: <Package className="h-4 w-4" />,
      color: "green" as const,
    },
    {
      title: "Broken Items",
      value: statistics.totalBroken,
      icon: <Package className="h-4 w-4" />,
      color: "red" as const,
    },
    {
      title: "Inactive Items",
      value: statistics.totalInactive,
      icon: <Package className="h-4 w-4" />,
      color: "gray" as const,
    },
    {
      title: "Total Items",
      value: statistics.grandTotal,
      icon: <Package className="h-4 w-4" />,
      color: "blue" as const,
    },
  ];

  const columns = [
    {
      key: "item",
      header: "Item Name",
      render: (itemDetail: TItemDetail) => (
        <span className="font-medium">
          {itemDetail.item?.name || "Unknown Item"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (itemDetail: TItemDetail) =>
        itemDetail.item?.category ? (
          <Badge variant="secondary">{itemDetail.item.category}</Badge>
        ) : null,
    },
    {
      key: "active_quantity",
      header: "Active",
      className: "text-center",
      render: (itemDetail: TItemDetail) => (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          {itemDetail.active_quantity}
        </Badge>
      ),
    },
    {
      key: "broken_quantity",
      header: "Broken",
      className: "text-center",
      render: (itemDetail: TItemDetail) => (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          {itemDetail.broken_quantity}
        </Badge>
      ),
    },
    {
      key: "inactive_quantity",
      header: "Inactive",
      className: "text-center",
      render: (itemDetail: TItemDetail) => (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          {itemDetail.inactive_quantity}
        </Badge>
      ),
    },
    {
      key: "total",
      header: "Total",
      className: "text-center",
      render: (itemDetail: TItemDetail) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 font-semibold"
        >
          {getTotalQuantity(itemDetail)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (itemDetail: TItemDetail) =>
        canManageUsers ? (
          <div className="flex items-center justify-end gap-2">
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
              onClick={() => handleDelete(itemDetail)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : null,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const breadcrumbs = [
    { label: "Audits", href: "/audits" },
    { label: `${audit?.month} ${audit?.year}`, href: `/audits/${auditId}` },
    { label: room?.name || "Room" },
  ];

  const headerDescription = (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Building className="h-4 w-4" />
        <span>
          {room?.name} - {room?.department}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>
          {audit?.month} {audit?.year}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Item Details"
        description={headerDescription}
        icon={<Package className="h-8 w-8" />}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/audits/${auditId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Audit
              </Button>
            </Link>
            {canManageUsers && !showForm && (
              <Button onClick={handleAddNew}>
                <Package className="h-4 w-4 mr-2" />
                Add Item Detail
              </Button>
            )}
          </div>
        }
      />

      <AnimatePresence>
        {showForm && (
          <ItemDetailsForm
            isOpen={showForm}
            onClose={handleCloseForm}
            itemDetail={editingItemDetail || undefined}
            auditId={auditId}
            roomId={roomId}
            existingItemIds={existingItemIds}
            onSuccess={() => {
              handleCloseForm();
            }}
          />
        )}
      </AnimatePresence>

      <StatisticsCards cards={statisticsCards} />

      <DataTable
        data={filteredItemDetails}
        columns={columns}
        title="Item Details"
        subtitle={`${filteredItemDetails.length} item${
          filteredItemDetails.length !== 1 ? "s" : ""
        } tracked`}
        emptyMessage="No item details found for this room. Add your first item detail to get started."
        emptyIcon={<Package className="h-12 w-12 text-gray-300" />}
      />

      {ConfirmationDialog}
    </motion.div>
  );
}
