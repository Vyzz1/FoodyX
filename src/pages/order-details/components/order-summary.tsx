import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subTotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: number;
  isPaid: boolean;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getPaymentMethodName(method: number) {
  const methods: { [key: string]: string } = {
    cod: "Cash on Delivery",
    stripe: "Credit Card",
    paypal: "Bank Transfer",
  };
  return methods[method] || "Unknown";
}

export function OrderSummary({
  subTotal,
  shippingFee,
  total,
  isPaid,
  paymentMethod,
}: OrderSummaryProps) {
  return (
    <Card className="border-amber-100">
      <CardHeader className="pb-3 border-b border-amber-100">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium dark:text-white">
              Subtotal
            </span>
            <span>{formatCurrency(subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium dark:text-white">
              Shipping
            </span>
            <span>
              {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
            </span>
          </div>
          <Separator className="my-2 bg-amber-100" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-amber-600">{formatCurrency(total)}</span>
          </div>
          <div className="mt-3 rounded-md bg-amber-50 p-2 text-sm border border-amber-100 dark:bg-transparent ">
            <p className="font-medium text-slate-800 dark:text-muted-foreground">
              Payment Method
            </p>
            <div className="text-sm flex items-center mt-3 gap-x-2 text-amber-600 font-semibold">
              {getPaymentMethodName(paymentMethod)}
              {isPaid && (
                <Badge
                  variant="outline"
                  className="text-amber-600 dark:text-amber-300"
                >
                  Paid
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
