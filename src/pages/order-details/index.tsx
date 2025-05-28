"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { OrderHeader } from "./components/order-header";
import { OrderSummaryBar } from "./components/order-summary-bar";
import { OrderLoadingSkeleton } from "./components/loading-skeleton";
import { OrderItems } from "./components/order-item";
import { OrderSummary } from "./components/order-summary";
import { CustomerInfo } from "./components/customer-info";
import { OrderTracking } from "./components/order-tracking";
import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import useSetTitle from "@/hooks/useSetTitle";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailsPage() {
  const [activeTab, setActiveTab] = useState("details");
  const handlePrint = () => {
    window.print();
  };

  const { id } = useParams();

  useSetTitle(`Order ${id}`);
  const {
    data: order,
    isLoading,
    error,
    isError,
  } = useFetchData(`/order/${id}`, "", "private");

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen place-items-center px-4 py-8">
        <OrderLoadingSkeleton />
      </div>
    );
  }

  if (error || isError || !order) {
    return (
      <div className="container mx-auto flex max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-muted/30 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">Order Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-muted-foreground">
              We couldn't retrieve order #{id}. This order may have been deleted
              or there might be a temporary issue with our system.
            </p>
            <Alert variant="default" className="mt-4 text-left">
              <AlertTitle className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="h-4 w-4" /> Troubleshooting
              </AlertTitle>
              <AlertDescription className="text-sm mt-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check if the order ID is correct</li>
                  <li>Try refreshing the page</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <Separator className="my-2" />
          <CardFooter className="flex justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 sm:px-6">
      <OrderHeader
        currentStatus={order.currentStatus}
        orderId={order.id}
        orderDate={order.orderDate}
        onPrint={handlePrint}
        shouldRepay={
          order.paymentMethod !== "cod" && order.payStatus === "Failed"
        }
      />

      <OrderSummaryBar
        id={order.id}
        date={order.orderDate}
        status={order.currentStatus}
      />

      <>
        <Tabs defaultValue="details" className="mb-6 no-print">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger
              value="details"
              onClick={() => setActiveTab("details")}
            >
              Order Details
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              onClick={() => setActiveTab("tracking")}
            >
              Order Tracking
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div
          className={cn(
            "grid gap-6 md:grid-cols-3",
            activeTab !== "details" && "no-print hidden"
          )}
        >
          <OrderItems items={order.items} />

          <div className="space-y-6">
            <OrderSummary
              isPaid={order.payStatus === "Success"}
              subTotal={order.subTotal}
              shippingFee={order.shippingFee}
              total={order.total}
              paymentMethod={order.paymentMethod}
            />

            <CustomerInfo
              fullName={order.fullName}
              specificAddress={order.specificAddress}
              fullAddress={order.fullAddress}
              phoneNumber={order.phoneNumber}
              note={order.note}
            />
          </div>
        </div>

        <div
          className={cn("mt-6", activeTab !== "tracking" && "no-print hidden")}
        >
          <OrderTracking
            statusHistories={order.statusHistories}
            orderDate={order.orderDate}
            currentStatus={order.currentStatus}
            paymentMethod={order.paymentMethod}
          />
        </div>
      </>
    </div>
  );
}
