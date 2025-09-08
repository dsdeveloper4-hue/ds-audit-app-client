"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Something went wrong",
  message = "Please check your internet connection or try again later.",
  icon = <AlertTriangle className="w-10 h-10 text-red-600" />,
  onRetry,
  retryLabel = "Retry",
}) => {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center px-6 text-center space-y-4">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        {icon}
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-red-600">{title}</h1>

      {/* Message */}
      <p className="max-w-sm text-sm text-gray-500">{message}</p>

      {/* Retry Button (optional) */}
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorPage;
