"use client";

import { useState } from "react";
import {
  useGetAllAssetPurchasesQuery,
  useDeleteAssetPurchaseMutation,
} from "@/redux/features/assetPurchase/assetPurchaseApi";
import { useGetAllRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, ShoppingCart } from "lucide-react";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { AssetPurchaseForm } from "@/components/forms/AssetPurchaseForm";
import { TAssetPurchase } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRole } from "@/hooks/useRole";

export default function AssetPurchasesPage() {
  const { canManageUsers } = useRole();
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<TAssetPurchase | null>(
    null
  );

  const { data, isLoading, error } = useGetAllAssetPurchasesQuery();
  const { data: roomsData } = useGetAllRoomsQuery();
  const { data: itemsData } = useGetAllItemsQuery();
  const [deleteAssetPurchase] = useDeleteAssetPurchaseMutation();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

  const purchases = data?.data || [];
  const rooms = roomsData?.data || [];
  const items = itemsData?.data || [];

  const handleDelete = (purchase: TAssetPurchase) => {
    confirm({
      title: "Delete Asset Purchase",
      description: `Are you sure you want to delete this purchase record? ${purchase.quantity} ${purchase.item.name}(s) for ${purchase.room.name}. This action cannot be undone.`,
      confirmText: "Delete Purchase",
      variant: "destructive",
      onConfirm: async () => {
        await deleteAssetPurchase(purchase.id).unwrap();
        toast.success("Asset purchase deleted successfully!");
      },
    });
  };

  const handleEdit = (purchase: TAssetPurchase) => {
    setEditingPurchase(purchase);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      key: "purchase_date",
      header: "Purchase Date",
      render: (purchase: TAssetPurchase) => formatDate(purchase.purchase_date),
    },
    {
      key: "item",
      header: "Item Name",
      render: (purchase: TAssetPurchase) => (
        <div>
          <p className="font-medium">{purchase.item.name}</p>
          {purchase.item.category && (
            <p className="text-xs text-gray-500">{purchase.item.category}</p>
          )}
        </div>
      ),
    },
    {
      key: "room",
      header: "Room",
      render: (purchase: TAssetPurchase) => (
        <div>
          <p className="font-medium">{purchase.room.name}</p>
          {purchase.room.floor && (
            <p className="text-xs text-gray-500">
              Floor: {purchase.room.floor}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (purchase: TAssetPurchase) => (
        <Badge variant="secondary">{purchase.quantity}</Badge>
      ),
    },
    {
      key: "unit_price",
      header: "Unit Price",
      render: (purchase: TAssetPurchase) => formatCurrency(purchase.unit_price),
    },
    {
      key: "total_cost",
      header: "Total Cost",
      render: (purchase: TAssetPurchase) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(purchase.total_cost)}
        </span>
      ),
    },
    {
      key: "added_by",
      header: "Added By",
      render: (purchase: TAssetPurchase) => purchase.user?.name || "—",
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (purchase: TAssetPurchase) => (
        <div className="flex items-center justify-end gap-2">
          {canManageUsers && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleEdit(purchase)}
                title="Edit Purchase"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(purchase)}
                title="Delete Purchase"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Calculate totals
  const totalPurchases = purchases.length;
  const totalCost = purchases.reduce((sum, p) => sum + Number(p.total_cost), 0);
  const totalItems = purchases.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Add Assets"
        description="Record and manage asset purchases"
        icon={<ShoppingCart className="h-8 w-8" />}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Purchases
          </p>
          <p className="text-2xl font-bold">{totalPurchases}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Items
          </p>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalCost)}
          </p>
        </div>
      </div>

      <AssetPurchaseForm
        isOpen={showForm}
        onClose={handleCloseForm}
        purchase={editingPurchase || undefined}
        rooms={rooms}
        items={items}
        onSuccess={() => {
          // Refresh handled by RTK Query
        }}
      />

      <DataTable
        data={purchases}
        columns={columns}
        emptyMessage="No asset purchases found. Add your first purchase to get started."
        emptyIcon={<ShoppingCart className="h-12 w-12 text-gray-300" />}
      />

      {ConfirmationDialog}
    </motion.div>
  );
}
