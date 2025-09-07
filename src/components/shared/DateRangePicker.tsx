"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* From Date Picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          From Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(parseISO(startDate), "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate ? parseISO(startDate) : undefined}
              onSelect={(date) =>
                setStartDate(date ? format(date, "yyyy-MM-dd") : "")
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To Date Picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          To Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(parseISO(endDate), "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate ? parseISO(endDate) : undefined}
              onSelect={(date) =>
                setEndDate(date ? format(date, "yyyy-MM-dd") : "")
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
