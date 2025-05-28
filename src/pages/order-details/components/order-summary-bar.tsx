import { format } from "date-fns";
import { Clock, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface OrderSummaryBarProps {
  id: string;
  date: string;
  status: string;
}

function getStatusVariant(status: string) {
  const variants: Record<OrderStatus, string> = {
    Pending: "warning",
    Processing: "info",
    Shipped: "default",
    Delivered: "success",
    Cancelled: "destructive",
  };
  return variants[status as OrderStatus] || "default";
}

export function OrderSummaryBar({ id, date, status }: OrderSummaryBarProps) {
  return (
    <Card className="mb-6 overflow-hidden border-amber-200 bg-amber-50/50 dark:bg-transparent dark:border-amber-700">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Receipt className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-50">
              Order ID
            </p>
            <p className="font-mono text-sm">{id.substring(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-50">
              Order Date
            </p>
            <p className="text-sm">{format(new Date(date), "PPP")}</p>
          </div>
        </div>
        <div>
          <Badge
            variant={getStatusVariant(status) as any}
            className="px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: status === "Pending" ? "#f59e0b" : undefined,
              color: status === "Pending" ? "white" : undefined,
            }}
          >
            {status}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
