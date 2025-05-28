"use client";

import { AmberLoading } from "@/components/shared/amber-loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSetTitle from "@/hooks/useSetTitle";
import useSubmitData from "@/hooks/useSubmitData";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function CancelPayment() {
  async function onSuccess(data: any) {
    if (data?.payUrl) {
      window.location.href = data.payUrl;
    } else {
      toast.error("An error occurred. Please try again or contact support.");
    }
  }
  useSetTitle("Payment Cancelled");
  const [params] = useSearchParams();

  const { mutate, isPending } = useSubmitData(
    "/payment/retry",
    onSuccess,
    (error: any) => {
      const message = error?.response?.data?.message || "An error occurred.";
      toast.error(message);
    }
  );

  const handleRetry = async () => {
    const orderId = params.get("order_id");

    if (!orderId) {
      toast.error("Order ID is missing. Please try again or contact support.");
      return;
    }
    mutate({ data: { orderId }, type: "post" });
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
      {isPending && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
            <AmberLoading className="h-10 w-10 animate-spin text-amber-500 dark:text-amber-400" />
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
              Processing Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Please wait while we process your request...
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 border-2 border-amber-300 dark:border-amber-600">
            <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-amber-300 mb-3">
            Payment Unsuccessful
          </h1>
          <p className="text-amber-700 dark:text-amber-400 text-lg">
            Your payment was not completed
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Don't worry, you can try again
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Your payment was canceled or didn't go through. Please try again
              with the same or a different payment method.
            </p>
          </div>

          <div className="relative h-48 mb-8 rounded-xl overflow-hidden">
            <img
              src="/images/cancle.avif"
              alt="Food illustration"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/70 dark:from-amber-600/80 to-transparent flex items-center">
              <div className="p-8 text-white max-w-md">
                <h3 className="text-2xl font-bold mb-2">We're Still Here!</h3>
                <p>
                  Your delicious food is waiting for you to complete your order.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            <h3 className="text-lg font-medium text-center text-amber-800 dark:text-amber-300">
              Pay Again
            </h3>

            <Button
              onClick={handleRetry}
              variant="secondary"
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again with Same Payment Method
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-amber-100 dark:border-amber-900/50 pt-6">
            <Button
              asChild
              disabled={isPending}
              variant="ghost"
              className="text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30 dark:hover:text-amber-300"
            >
              <Link to="/orders" replace>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
            >
              <Link to="/" replace>
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center text-amber-700 dark:text-amber-400">
        <p>
          Having trouble with your payment?{" "}
          <a
            href="#"
            className="underline font-medium hover:text-amber-800 dark:hover:text-amber-300"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
