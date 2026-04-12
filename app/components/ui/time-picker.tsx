"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "./utils";

interface TimePickerProps {
  value?: string; // HH:mm format
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  className,
  placeholder = "08:00",
  disabled = false,
}: TimePickerProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Clock className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="time"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 shadow-sm",
          "appearance-none", // Hide default mobile appearance details if possible
          !value && "text-gray-400"
        )}
      />
      {/* 
          Note: Native browsers often add their own internal icons. 
          If you want to hide the browser's default calendar/time icon:
          Add global CSS: input[type="time"]::-webkit-calendar-picker-indicator { display: none; }
      */}
    </div>
  );
}
