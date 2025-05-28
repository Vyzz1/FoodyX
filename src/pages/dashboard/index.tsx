import DateRangeFilter from "@/components/shared/date-range-filter";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import { RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DashboardOverview } from "./components/dashboard-overview";
import RevenueChart from "./components/revenue-chart";
import { AmberLoading } from "@/components/shared/amber-loading";
import PaymentCharts from "./components/payment-chart";

export default function Dashboard() {
  const [params] = useSearchParams();

  const { data, isLoading, isError, refetch } = useFetchData(
    `/dashboard/data/?${params}`,
    "",
    "private"
  );

  if (isError) {
    return <div>Error loading dashboard data</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AmberLoading />
      </div>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="admin-title">Dashboard</h2>
        <div className="flex lg:items-center justify-between mb-6 flex-col sm:flex-row gap-y-3  sm:items-center">
          <Button onClick={() => refetch()} size={"sm"} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DateRangeFilter />
        </div>

        <div className="mt-8">
          <DashboardOverview
            isLoading={isLoading}
            totalRevenue={data?.totalRevenue || 0}
            totalProfit={data?.totalProfit || 0}
            totalCost={data?.totalCost || 0}
            totalOrders={data?.totalOrders || 0}
            totalUsers={data?.totalUsers || 0}
          />
        </div>

        <div className="mt-8 ">
          <RevenueChart chartData={data.revenueSummaryChart} />
        </div>

        <div className="mt-8 ">
          <PaymentCharts paymentData={data.paymentsChart} />
        </div>
      </div>
    </section>
  );
}
