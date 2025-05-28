import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  FileText,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Timeline } from "@/components/shared/timeline";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
  orderDate: string;
  currentStatus: string;
  paymentMethod: number;
  statusHistories?: {
    id: string;
    status: string;
    changedAt: string;
  }[];
}

function getPaymentMethodName(method: number) {
  const methods: Record<string, string> = {
    cod: "Cash on Delivery",
    stripe: "Credit Card",
    paypal: "Bank Transfer",
  };
  return methods[method] || "Unknown";
}

export function OrderTracking({
  orderDate,
  currentStatus,
  statusHistories,
  paymentMethod,
}: OrderTrackingProps) {
  function getStatusTimeline(status: string) {
    const statusHistory = statusHistories?.find(
      (history) => history.status === status
    );
    return statusHistory
      ? format(new Date(statusHistory.changedAt), "PPp")
      : null;
  }

  function getStatusIcon(status: string, className?: string) {
    const iconClassName = cn("size-5 text-slate-400", className);
    switch (status) {
      case "Pending":
        return <Clock className={iconClassName} />;
      case "Processing":
        return <ShoppingBag className={iconClassName} />;
      case "Shipped":
        return <Truck className={iconClassName} />;
      case "Delivered":
        return <CheckCircle className={iconClassName} />;
      case "Cancelled":
        return <X className={iconClassName} />;
      default:
        return null;
    }
  }

  const statusTimeline = [
    {
      status: "Pending",
      description: "Your order has been received and is awaiting processing",
      icon: getStatusIcon("Pending"),
      date: format(new Date(orderDate), "PPp"),
      active: currentStatus === "Pending",
    },
    {
      status: "Processing",
      description: "Your order is being prepared by our kitchen staff",
      icon: getStatusIcon("Processing"),
      active: currentStatus === "Processing",
      date: getStatusTimeline("Processing"),
    },
    {
      status: "Shipped",
      description: "Your order is on the way to your delivery address",
      icon: getStatusIcon("Shipped"),
      active: currentStatus === "Shipped",
      date: getStatusTimeline("Shipped"),
    },
    {
      status: "Delivered",
      description: "Your order has been delivered successfully",
      icon: getStatusIcon("Delivered"),
      active: currentStatus === "Delivered",
      date: getStatusTimeline("Delivered"),
    },
  ];

  return (
    <Card className="border-amber-100">
      <CardHeader className="border-b border-amber-100">
        <CardTitle>Order Tracking</CardTitle>
        <CardDescription>
          Track your order status and delivery progress
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {statusTimeline.map((status, index) => (
            <div
              key={status.status}
              className={cn(
                "relative flex-1 rounded-lg border p-4 transition-all",
                status.active
                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/50"
                  : "border-muted bg-muted/30"
              )}
            >
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 top-1/2 h-0.5 w-4 -translate-x-full transform",
                    status.active ? "bg-amber-400" : "bg-muted-foreground/30"
                  )}
                />
              )}
              <div className="mb-2">{status.icon}</div>
              <h3
                className={cn(
                  "font-medium",
                  status.active && "!text-amber-700"
                )}
              >
                {status.status}
              </h3>
              <p className="text-sm text-muted-foreground">
                {status.description}
              </p>
              {status.date && (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  {status.date}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:bg-transparent">
          <h3 className="mb-4 font-medium">Detailed Status History</h3>
          <Timeline
            items={[
              {
                title: "Order Placed",
                description:
                  "Your order has been received and is being processed",
                date: format(new Date(orderDate), "PPp"),
                icon: (
                  <Clock className="size-3 dark:text-emerald-950 text-amber-500" />
                ),
              },
              {
                title: "Payment Confirmed",
                description: `Payment method: ${getPaymentMethodName(
                  paymentMethod
                )}`,
                date: format(new Date(orderDate), "PPp"),
                icon: (
                  <FileText className="size-3 dark:text-emerald-950 text-amber-500" />
                ),
              },
              ...(statusHistories
                ?.filter((v) => v.status !== "Pending")
                .map((history) => ({
                  title: history.status,
                  description: `Status changed to ${history.status}`,
                  date: format(new Date(history.changedAt), "PPp"),
                  icon: getStatusIcon(
                    history.status,
                    "size-3 dark:text-emerald-950 text-amber-500"
                  ),
                })) || []),
            ]}
            className="text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
