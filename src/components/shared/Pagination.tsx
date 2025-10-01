"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 items-center gap-2 flex-wrap">
      {/* Prev */}
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        size="sm"
        variant="outline"
      >
        Prev
      </Button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          onClick={() => onPageChange(p)}
          size="sm"
          variant={p === page ? "default" : "outline"}
          className={p === page ? "bg-blue-600 text-white" : ""}
        >
          {p}
        </Button>
      ))}

      {/* Next */}
      <Button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
