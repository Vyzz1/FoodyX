"use client";

import { format } from "date-fns";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ChangeOrderStatus from "@/components/shared/change-order-status";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import RepayButton from "@/components/shared/repay-button";
import { useEffect, useRef } from "react";

interface OrderHeaderProps {
  orderId: string;
  orderDate: string;
  onPrint: () => void;
  currentStatus?: string;
  shouldRepay?: boolean;
}

export function OrderHeader({
  orderId,
  orderDate,
  onPrint,
  currentStatus,
  shouldRepay,
}: OrderHeaderProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toastIdRef = useRef<string | number | null>(null);

  const isAdmin = currentUser?.role.toLowerCase() === "admin";
  const queryClient = useQueryClient();

  function onSuccess() {
    queryClient.invalidateQueries({
      queryKey: ["fetchData", `/order/${orderId}`],
    });

    queryClient.invalidateQueries({
      queryKey: ["fetchData", `/order/admin`],
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "fetchData" &&
        query.queryKey[1].startsWith("/order/admin"),
    });
  }

  const { mutate, isPending, isSuccess } = useSubmitData(
    `/order/${orderId}`,
    onSuccess,
    (error: any) => {
      const message = error?.response?.data?.message || "An error occurred.";
      // Dismiss loading toast if it exists
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.error(message);
    }
  );

  // Handle loading state
  useEffect(() => {
    if (isPending && !toastIdRef.current) {
      toastIdRef.current = toast.loading("Changing order status...");
    }
  }, [isPending]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toast.success("Order status changed successfully");
      toastIdRef.current = null;
    }
  }, [isSuccess]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 no-print"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        <div className="flex gap-2 no-print items-center">
          {isAdmin && (
            <ChangeOrderStatus
              isTrigeer={true}
              isFinish={isSuccess}
              currentStatus={currentStatus!}
              onChangeStatus={(status) => {
                mutate({ data: { status }, type: "patch" });
              }}
              loading={isPending}
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-100 text-amber-900 dark:bg-amber-700 dark:text-white"
              >
                Change Status
              </Button>
            </ChangeOrderStatus>
          )}
          {!isAdmin && shouldRepay && <RepayButton orderId={orderId} />}
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="print-only mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order Receipt</h1>
            <p className="text-muted-foreground">Thank you for your order!</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Order #{orderId.substring(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(orderDate), "PPP")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
