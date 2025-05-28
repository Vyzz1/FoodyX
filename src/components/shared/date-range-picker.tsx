import * as React from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";
import { CalendarIcon, ChevronRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar-real";

export type DateRange = {
  from: Date;
  to: Date;
} | null;

export type PresetKey =
  | "today"
  | "yesterday"
  | "last7Days"
  | "thisYear"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "last60Days"
  | "custom"
  | null;

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange, presetKey: PresetKey) => void;
  className?: string;
  selectedPreset: PresetKey;
}

export function DateRangePicker({
  dateRange,
  onChange,
  selectedPreset,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const presets = React.useMemo(
    () => [
      {
        key: "today" as PresetKey,
        name: "Today",
        getValue: () => {
          const now = new Date();
          const todayStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
          );
          const todayEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
          );

          return {
            from: todayStart,
            to: todayEnd,
          };
        },
      },
      {
        key: "yesterday" as PresetKey,
        name: "Yesterday",
        getValue: () => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const yesterdayStart = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            0,
            0,
            0
          );
          const yesterdayEnd = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            23,
            59,
            59,
            999
          );

          return {
            from: yesterdayStart,
            to: yesterdayEnd,
          };
        },
      },
      {
        key: "last7Days" as PresetKey,
        name: "Last 7 days",
        getValue: () => {
          const now = new Date();
          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 6);

          const last7DaysStart = new Date(
            last7Days.getFullYear(),
            last7Days.getMonth(),
            last7Days.getDate(),
            0,
            0,
            0
          );

          const todayEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
          );

          return {
            from: last7DaysStart,
            to: todayEnd,
          };
        },
      },
      {
        key: "lastWeek" as PresetKey,
        name: "Last week",
        getValue: () => {
          const now = new Date();
          const lastWeekStart = startOfWeek(subWeeks(now, 1));
          const lastWeekEnd = endOfWeek(subWeeks(now, 1));

          return {
            from: lastWeekStart,
            to: lastWeekEnd,
          };
        },
      },
      {
        key: "thisYear" as PresetKey,
        name: "This year",
        getValue: () => {
          const now = new Date();
          const thisYearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          const thisYearEnd = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );

          return {
            from: thisYearStart,
            to: thisYearEnd,
          };
        },
      },

      {
        key: "thisMonth" as PresetKey,
        name: "This month",
        getValue: () => {
          const now = new Date();
          const thisMonthStart = startOfMonth(now);
          const thisMonthEnd = endOfMonth(now);

          return {
            from: thisMonthStart,
            to: thisMonthEnd,
          };
        },
      },
      {
        key: "lastMonth" as PresetKey,
        name: "Last month",
        getValue: () => {
          const now = new Date();
          return {
            from: startOfMonth(subMonths(now, 1)),
            to: endOfMonth(subMonths(now, 1)),
          };
        },
      },
      {
        key: "last60Days" as PresetKey,
        name: "Last 60 days",
        getValue: () => {
          const now = new Date();
          const last60DaysStart = new Date();
          last60DaysStart.setDate(last60DaysStart.getDate() - 59);

          const startDate = new Date(
            last60DaysStart.getFullYear(),
            last60DaysStart.getMonth(),
            last60DaysStart.getDate(),
            0,
            0,
            0
          );

          const endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
          );
          return {
            from: startDate,
            to: endDate,
          };
        },
      },
    ],
    []
  );

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-start gap-y-2   md:items-center",
        className
      )}
    >
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger>
          <Button
            variant="outline"
            className="font-medium border-dashed border-slate-600"
          >
            Date Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="border-r p-2">
              <div className="px-3 py-2 text-sm font-medium">Presets</div>
              <div className="grid gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.key}
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => {
                      const newRange = preset.getValue();
                      onChange(newRange, preset.key);
                      setIsCalendarOpen(false);
                    }}
                  >
                    <div className="flex items-center w-full justify-between">
                      <span>{preset.name}</span>
                      {selectedPreset === preset.key && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="justify-start font-normal text-destructive hover:text-destructive"
                  onClick={() => {
                    onChange(null, null);
                    setIsCalendarOpen(false);
                  }}
                >
                  Clear selection
                </Button>
              </div>
            </div>
            <div className="p-2">
              <Calendar
                initialFocus
                captionLayout="dropdown-buttons"
                mode="range"
                defaultMonth={dateRange?.from ? dateRange.from : new Date()}
                selected={
                  dateRange
                    ? {
                        from: dateRange.from,
                        to: dateRange.to,
                      }
                    : undefined
                }
                onSelect={(range) => {
                  console.log("Selected range:", range);
                  if (range?.from && range?.to) {
                    onChange(
                      {
                        from: range.from,
                        to: range.to,
                      },
                      "custom"
                    );
                  } else {
                    onChange(null, null);
                  }
                }}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {dateRange?.from && dateRange?.to ? (
        <div className="md:ml-2 flex items-center rounded-md border px-3 py-1.5 relative group">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">
                {format(dateRange.from.toLocaleDateString(), "MMMM do, yyyy")}
              </div>
              {/* <div className="text-xs text-muted-foreground">
                {format(dateRange.from, "h:mm a")}
              </div> */}
            </div>
            <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">
                {format(dateRange.to.toLocaleDateString(), "MMMM do, yyyy")}
              </div>
              {/* <div className="text-xs text-muted-foreground">
                {format(dateRange.to, "h:mm a")}
              </div> */}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
