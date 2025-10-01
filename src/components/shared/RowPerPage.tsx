"use client";

import React from "react";

interface RowsPerPageProps {
  limit: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  limitOptions?: number[];
}

const RowsPerPage: React.FC<RowsPerPageProps> = ({
  limit,
  setLimit,
  setPage,
  limitOptions = [50, 100, 200, 500, 1000],
}) => {
  return (
    <div className="flex flex-col min-w-[120px] flex-1">
      <label className="text-sm text-gray-600 mb-1">Rows per page</label>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1); // reset to first page
        }}
        className="h-10 border border-blue-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
      >
        {limitOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default RowsPerPage;
