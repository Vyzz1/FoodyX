import { AmberLoading } from "./amber-loading";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface RepayButtonProps {
  orderId: string;
}

export default function RepayButton({ orderId }: RepayButtonProps) {
  if (!orderId) {
    throw new Error("orderId is required");
  }

  async function onSuccess(data: any) {
    if (data?.payUrl) {
      window.location.href = data.payUrl;
    } else {
      toast.error("An error occurred. Please try again or contact support.");
    }
  }
  const { mutate, isPending } = useSubmitData(
    "/payment/retry",
    onSuccess,
    (error: any) => {
      const message = error?.response?.data?.message || "An error occurred.";
      toast.error(message);
    }
  );

  const handleRetry = async () => {
    if (!orderId) {
      toast.error("Order ID is missing. Please try again or contact support.");
      return;
    }
    mutate({ data: { orderId }, type: "post" });
  };

  return (
    <div>
      {isPending && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <AmberLoading size="lg" text="Proccessing Payment..." />
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size={"sm"}
        className="bg-amber-500 text-white"
        onClick={handleRetry}
        disabled={isPending}
      >
        {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        Retry Payment
      </Button>
    </div>
  );
}
