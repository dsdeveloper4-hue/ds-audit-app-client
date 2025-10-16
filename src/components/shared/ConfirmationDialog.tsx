"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  icon?: React.ReactNode;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  icon,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error: any) {
      console.error("Confirmation action failed:", error);
      toast.error(error?.message || "Action failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-md p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              {icon || (
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  variant === "destructive" 
                    ? "bg-red-100 dark:bg-red-900" 
                    : "bg-blue-100 dark:bg-blue-900"
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    variant === "destructive" 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-blue-600 dark:text-blue-400"
                  }`} />
                </div>
              )}
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {cancelText}
              </Button>
              <Button
                variant={variant}
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for easy confirmation dialogs
export function useConfirmationDialog() {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    confirmText?: string;
    variant?: "destructive" | "default";
  } | null>(null);

  const confirm = (options: {
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    confirmText?: string;
    variant?: "destructive" | "default";
  }) => {
    setDialog({
      isOpen: true,
      ...options,
    });
  };

  const closeDialog = () => {
    setDialog(null);
  };

  const ConfirmationDialogComponent = dialog ? (
    <ConfirmationDialog
      isOpen={dialog.isOpen}
      onClose={closeDialog}
      onConfirm={dialog.onConfirm}
      title={dialog.title}
      description={dialog.description}
      confirmText={dialog.confirmText}
      variant={dialog.variant}
    />
  ) : null;

  return {
    confirm,
    ConfirmationDialog: ConfirmationDialogComponent,
  };
}
