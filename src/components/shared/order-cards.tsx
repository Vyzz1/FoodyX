import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate, getStatusClassName } from "@/lib/utils";
import { ClipboardList, Package, ShoppingBag } from "lucide-react";

interface OrderMetricsCardsProps {
  isLoading: boolean;
  orders: any;
}

export default function OrderMetricsCards({
  isLoading,
  orders,
}: OrderMetricsCardsProps) {
  const calculateMetrics = () => {
    if (!orders || !orders.content || orders.content.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        recentOrder: { total: 0, date: null, status: null },
      };
    }

    const totalOrders = orders.totalCount || orders.content.length;
    const totalRevenue = orders.content.reduce(
      (sum: any, order: { total: any }) => sum + (order.total || 0),
      0
    );

    const sortedByDate = [...orders.content].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    const recentOrder =
      sortedByDate.length > 0
        ? {
            total: sortedByDate[0].total,
            date: sortedByDate[0].orderDate,
            status: sortedByDate[0].currentStatus,
          }
        : { total: 0, date: null, status: null };

    return { totalOrders, totalRevenue, recentOrder };
  };

  const { totalOrders, totalRevenue, recentOrder } = isLoading
    ? {
        totalOrders: 0,
        totalRevenue: 0,
        recentOrder: { total: 0, date: null, status: null },
      }
    : calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              totalOrders.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All orders in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              formatCurrency(totalRevenue)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Revenue from displayed orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Latest Order</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Package className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              formatCurrency(recentOrder.total)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <span className="h-4 w-20 bg-muted animate-pulse rounded"></span>
            ) : recentOrder.date ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(recentOrder.date)}
                </p>
                {recentOrder.status && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full inline-block w-fit mt-1 ${getStatusClassName(
                      recentOrder.status
                    )}`}
                  >
                    {recentOrder.status}
                  </span>
                )}
              </>
            ) : (
              "No orders yet"
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
