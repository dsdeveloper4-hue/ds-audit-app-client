"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAuditByIdQuery } from "@/redux/features/audit/auditApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Building } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";

import { useGetAllRoomsQuery } from "@/redux/features";
import Link from "next/link";

export default function AuditDetailsPage() {
  const {auditId:id} = useParams();
  const router = useRouter();
  const { data: auditData, isLoading: auditLoading } = useGetAuditByIdQuery(
    String(id)
  );
  const { data: rooms, isLoading, error } = useGetAllRoomsQuery();
  const allRooms = rooms?.data || [];

  if (auditLoading) return <Loading />;
  if (!auditData?.data) return <Error />;

  const audit = auditData.data;
  const itemDetails = audit.itemDetails || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      IN_PROGRESS: "secondary",
      COMPLETED: "default",
      CANCELED: "destructive",
    };

    const colors: Record<string, string> = {
      IN_PROGRESS:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      COMPLETED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <Badge
        variant={variants[status] || "secondary"}
        className={colors[status]}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Audits
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {new Date(audit.year, audit.month - 1).toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge(audit.status)}
          </div>
        </div>
      </div>

      {/* Audit Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created Date
            </p>
            <p className="text-lg font-semibold">
              {new Date(audit.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Participants
            </p>
            <p className="text-lg font-semibold">
              {audit.participants && audit.participants.length > 0
                ? audit.participants.map((p) => p.name).join(", ")
                : "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Item Details
            </p>
            <p className="text-lg font-semibold">{itemDetails.length}</p>
          </div>
        </div>
        {audit.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
            <p className="text-base mt-1">{audit.notes}</p>
          </div>
        )}
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allRooms.length === 0 ? (
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
                  allRooms.map((room, index) => (
                    <motion.tr
                      key={room.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.floor || "—"}</TableCell>
                      <TableCell>{room.department || "—"}</TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                        <Link href={`/audits/${id}/${room.id}`}>
                            <Button size="sm" >
                              View
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
