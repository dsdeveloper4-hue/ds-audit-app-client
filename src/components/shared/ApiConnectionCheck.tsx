"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ApiConnectionCheck() {
  const [isChecking, setIsChecking] = useState(true);
  // const [isConnected, setIsConnected] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    setIsChecking(true);
    const url =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    setApiUrl(url);

    try {
      const response = await fetch(`${url}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok || response.status === 404) {
        // 404 means server is running but no health endpoint
        // setIsConnected(true);
        setShowWarning(false);
      } else {
        // setIsConnected(false);
        setShowWarning(true);
      }
    } catch (error) {
      console.log(error);
      // setIsConnected(false);
      setShowWarning(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return null; // Don't show anything while checking
  }

  if (!showWarning) {
    return null; // Connection is good
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-md">
      <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Cannot Connect to API
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              The app cannot reach the backend server at:
            </p>
            <code className="block text-xs bg-yellow-100 dark:bg-yellow-900 p-2 rounded mb-3 break-all">
              {apiUrl}
            </code>
            <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Quick Fix:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Make sure backend is running on port 5000</li>
                <li>
                  Create{" "}
                  <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                    .env.local
                  </code>{" "}
                  file
                </li>
                <li>
                  Add:{" "}
                  <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
                  </code>
                </li>
                <li>Restart frontend server</li>
              </ol>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={checkApiConnection}
                className="text-xs"
              >
                Retry Connection
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowWarning(false)}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
