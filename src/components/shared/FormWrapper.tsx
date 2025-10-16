"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

export function FormWrapper({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading = false,
  submitText = "Save",
  cancelText = "Cancel",
  className,
}: FormWrapperProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`p-6 overflow-hidden ${className || ""}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-4">
              {children}
              
              <div className="flex items-center gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    submitText
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
