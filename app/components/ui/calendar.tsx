"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption:
          "flex justify-center pt-0.5 pb-1 relative items-center w-full",
        caption_label:
          "text-sm font-medium text-foreground tracking-wide select-none",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 p-0 opacity-40 hover:opacity-100 hover:bg-accent absolute left-0 transition-opacity",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 p-0 opacity-40 hover:opacity-100 hover:bg-accent absolute right-0 transition-opacity",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday:
          "text-muted-foreground w-9 text-center text-[0.72rem] font-medium uppercase tracking-wider select-none",
        week: "flex w-full",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent/60",
          "[&:has([aria-selected].day-range-end)]:rounded-r-full",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal rounded-full aria-selected:opacity-100",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        ),
        range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground rounded-l-full",
        range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground rounded-r-full",
        selected: cn(
          "bg-primary text-primary-foreground rounded-full",
          "hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground",
        ),
        today: cn(
          "font-semibold",
          "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2",
          "after:w-1 after:h-1 after:rounded-full after:bg-primary",
          "aria-selected:after:bg-primary-foreground",
        ),
        outside:
          "day-outside text-muted-foreground/40 aria-selected:bg-accent/30 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground/30 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-accent/60 aria-selected:text-accent-foreground rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="size-4" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };