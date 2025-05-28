import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentChartProps {
  paymentData: {
    amount: number;
    status: string;
    paidAt: string;
  }[];
}

export default function PaymentCharts({ paymentData }: PaymentChartProps) {
  const groupedByDay = paymentData.reduce((acc, payment) => {
    const day = format(parseISO(payment.paidAt), "yyyy-MM-dd");

    if (!acc[day]) {
      acc[day] = {
        date: day,
        displayDate: format(parseISO(payment.paidAt), "MMM dd"),
        successAmount: 0,
        failedAmount: 0,
        totalAmount: 0,
        count: 0,
        successCount: 0,
        failedCount: 0,
      };
    }

    acc[day].count += 1;
    acc[day].totalAmount += payment.amount;

    if (payment.status === "Success") {
      acc[day].successAmount += payment.amount;
      acc[day].successCount += 1;
    } else if (payment.status === "Failed") {
      acc[day].failedAmount += payment.amount;
      acc[day].failedCount += 1;
    }

    return acc;
  }, {} as Record<string, any>);

  const dailyData = Object.values(groupedByDay).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalPayments = paymentData.length;
  const successfulPayments = paymentData.filter(
    (p) => p.status === "Success"
  ).length;
  const failedPayments = paymentData.filter(
    (p) => p.status === "Failed"
  ).length;
  const totalAmount = paymentData
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);
  const successfulAmount = paymentData
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);
  const failedAmount = paymentData
    .filter((p) => p.status === "Failed")
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-green-500">
            Success: ${dayData.successAmount.toFixed(2)} ({dayData.successCount}{" "}
            payments)
          </p>
          <p className="text-red-500">
            Failed: ${dayData.failedAmount.toFixed(2)} ({dayData.failedCount}{" "}
            payments)
          </p>
          <p className="font-medium mt-1">
            Total: ${dayData.totalAmount.toFixed(2)} ({dayData.count} payments)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-4 rounded-lg shadow">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              ${totalAmount} total volume
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {successfulPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              ${successfulAmount} processed successfully
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {failedPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              ${failedAmount} failed to process
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPayments > 0
                ? ((successfulPayments / totalPayments) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {successfulPayments} out of {totalPayments} payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daily Payment Distribution</CardTitle>
          <CardDescription>View payment amounts grouped by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="displayDate" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="successAmount"
                  name="Successful Payments"
                  stackId="a"
                  fill="#10b981"
                />
                <Bar
                  dataKey="failedAmount"
                  name="Failed Payments"
                  stackId="a"
                  fill="#ef4444"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
