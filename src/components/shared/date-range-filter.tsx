import {
  DateRange,
  DateRangePicker,
  PresetKey,
} from "@/components/shared/date-range-picker";
import { endOfDay, startOfDay } from "date-fns";
import React from "react";
import { useSearchParams } from "react-router-dom";

const DateRangeFilter = () => {
  const [params, setParams] = useSearchParams();
  const last60Preset = () => {
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
      from: startOfDay(startDate),
      to: endOfDay(endDate),
    };
  };
  const defaultDateRange = {
    from: params.get("fromDate")
      ? new Date(params.get("fromDate")!)
      : last60Preset().from,
    to: params.get("toDate")
      ? new Date(params.get("toDate")!)
      : last60Preset().to,
  };

  const [dateRange, setDateRange] = React.useState<DateRange>(defaultDateRange);

  return (
    <DateRangePicker
      dateRange={dateRange}
      selectedPreset={(params.get("preset") as PresetKey) || "last60Days"}
      onChange={(range, preset) => {
        if (preset) {
          params.set("preset", preset);
        }
        setDateRange(range);

        const newParams = new URLSearchParams(params.toString());

        if (range) {
          newParams.set("fromDate", range.from.toLocaleDateString());
          newParams.set("toDate", range.to.toLocaleDateString());
        } else {
          newParams.delete("fromDate");
          newParams.delete("toDate");
          newParams.delete("preset");
        }
        setParams(newParams);
      }}
    />
  );
};

export default DateRangeFilter;
