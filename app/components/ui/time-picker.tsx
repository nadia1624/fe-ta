"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";
import { Button } from "./button";

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
  const [open, setOpen] = React.useState(false);
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const currentHour = value?.split(':')[0] || "08";
  const currentMinute = value?.split(':')[1] || "00";

  const handleSelect = (h: string, m: string) => {
    onChange?.(`${h}:${m}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left text-sm transition-all hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:opacity-50 shadow-sm",
            !value && "text-gray-400",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{value || placeholder}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0 overflow-hidden rounded-xl border border-gray-100 shadow-lg" align="start">
        <div className="bg-white">
          <div className="flex h-56">
            {/* Hours */}
            <div className="flex-1 overflow-y-auto border-r scrollbar-none snap-y snap-mandatory pb-24 pt-24">
              <div className="px-1.5">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleSelect(h, currentMinute)}
                    className={cn(
                      "w-full h-8 flex items-center justify-center text-xs rounded-md transition-colors snap-center mb-0.5",
                      currentHour === h 
                        ? "bg-blue-600 text-white font-medium" 
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            {/* Minutes */}
            <div className="flex-1 overflow-y-auto scrollbar-none snap-y snap-mandatory pb-24 pt-24">
              <div className="px-1.5">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelect(currentHour, m)}
                    className={cn(
                      "w-full h-8 flex items-center justify-center text-xs rounded-md transition-colors snap-center mb-0.5",
                      currentMinute === m 
                        ? "bg-blue-600 text-white font-medium" 
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-2 border-t bg-gray-50/30 flex justify-center">
             <Button 
               variant="default" 
               size="sm" 
               className="w-full h-8 text-[11px] bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg" 
               onClick={() => setOpen(false)}
             >
               Selesai
             </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
