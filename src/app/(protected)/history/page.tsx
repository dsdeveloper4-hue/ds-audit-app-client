"use client";

import { useGetRecentActivityQuery, useGetActivityStatsQuery } from "@/redux/features/history/historyApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Database, Trash2, Edit, Plus, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityHistoryItem {
  id: string;
  entity_type: string;
  entity_name: string | null;
  entity_id: string | null;
  action_type: "CREATE" | "UPDATE" | "DELETE" | "READ";
  description: string | null;
  occurred_at: string;
  user: {
    id: string;
    name: string;
    mobile: string;
    role: string;
  } | null;
  before: any;
  after: any;
  change_summary: any;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case "CREATE":
      return <Plus className="h-4 w-4" />;
    case "UPDATE":
      return <Edit className="h-4 w-4" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "UPDATE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "DELETE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "Audit":
      return "📋";
    case "Item":
      return "📦";
    case "Room":
      return "🏠";
    case "User":
      return "👤";
    case "ItemDetails":
      return "📊";
    default:
      return "📄";
  }
};

export default function HistoryPage() {
  const { data: activityData, isLoading: isLoadingActivity } = useGetRecentActivityQuery({ limit: 50 });
  const { data: statsData, isLoading: isLoadingStats } = useGetActivityStatsQuery(null);

  const activities: ActivityHistoryItem[] = activityData?.data || [];
  const stats = statsData?.data || {};

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
        <p className="text-muted-foreground">
          Track all changes and activities across your audit system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalActivities || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.todayActivities || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Activities today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.weekActivities || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.byEntityType?.[0]?.entity_type || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.byEntityType?.[0]?._count || 0} changes
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes and activities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingActivity ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getActionColor(activity.action_type)}`}>
                      {getActionIcon(activity.action_type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{getEntityIcon(activity.entity_type)}</span>
                        <Badge variant="outline" className="font-normal">
                          {activity.entity_type}
                        </Badge>
                        <Badge className={getActionColor(activity.action_type)}>
                          {activity.action_type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-medium mb-1">
                      {activity.entity_name || "Unknown entity"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description || "No description"}
                    </p>

                    {/* Change Summary */}
                    {activity.change_summary?.changes && (
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mb-2">
                        <strong>Changes:</strong> {activity.change_summary.changes.join(", ")}
                      </div>
                    )}

                    {/* User Info */}
                    {activity.user && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>By</span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.user.name}
                        </Badge>
                        <span className="text-xs">({activity.user.role})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
