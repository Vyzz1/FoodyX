import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export default function RevenueChart({ chartData }: { chartData: any[] }) {
  const dailyData = useMemo(() => {
    const groupedByDay = [...chartData].reduce((acc, item) => {
      const day = format(parseISO(item.calculatedAt), "yyyy-MM-dd");

      if (!acc[day]) {
        acc[day] = {
          date: day,
          displayDate: format(parseISO(item.calculatedAt), "MMM dd"),
          shortDate: format(parseISO(item.calculatedAt), "MM/dd"),
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          entries: 0,
        };
      }

      acc[day].totalRevenue += item.totalRevenue;
      acc[day].totalCost += item.totalCost;
      acc[day].totalProfit += item.totalProfit;
      acc[day].entries += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedByDay).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [chartData]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="w-full p-2 sm:p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2 sm:mb-4">
        Daily Revenue, Cost, and Profit Analysis
      </h2>
      <ChartContainer
        config={{
          revenue: {
            label: "Revenue",
            color: "#2c7be5",
          },
          cost: {
            label: "Cost",
            color: "#ff7300",
          },
          profit: {
            label: "Profit",
            color: "#82ca9d",
          },
        }}
        className="h-[300px] sm:h-[350px] md:h-[400px] w-full"
      >
        <LineChart
          accessibilityLayer
          data={dailyData}
          margin={{
            top: 20,
            right: isMobile ? 10 : 30,
            left: isMobile ? 10 : 20,
            bottom: isMobile ? 50 : 40,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={isMobile ? "shortDate" : "displayDate"}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            angle={isMobile ? -45 : -30}
            textAnchor="end"
            height={isMobile ? 50 : 40}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
            width={isMobile ? 40 : 60}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  typeof value === "number"
                    ? `$${value.toFixed(2)}`
                    : `$${value}`
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            name="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="totalCost"
            name="cost"
            stroke="var(--color-cost)"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="totalProfit"
            name="profit"
            stroke="var(--color-profit)"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
