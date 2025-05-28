import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChoosePayment from "@/pages/checkout/components/choose-payment";

interface MobileCheckoutBarProps {
  total: number;
  onCheckout: () => void;
  title: string;
  isInCheckout?: boolean;

  payment?: string;
  setPaymentOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isPending?: boolean;
}

export default function MobileCheckoutBar({
  total,
  onCheckout,
  isInCheckout = false,

  isPending = false,
  title,
  payment,
  setPaymentOpen,
}: MobileCheckoutBarProps) {
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-amber-200 dark:border-amber-800 p-3 lg:hidden z-50 shadow-lg ">
      <div className="flex flex-col  gap-y-6 justify-between max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex justify-between gap-2">
            <p className="  text-slate-800 dark:text-emerald-50">Total</p>
            <p className="text-amber-400 font-semibold text-base">
              ${grandTotal.toFixed(2)}
            </p>
          </div>

          <div className=" flex justify-between gap-2">
            <p className=" text-slate-800 dark:text-amber-50"> Shipping Fee</p>
            <p className="text-amber-400 font-semibold text-sm">
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </p>
          </div>

          {isInCheckout && (
            <ChoosePayment
              setPaymentOpen={setPaymentOpen!}
              payment={payment!}
            />
          )}
        </div>
        <Button
          disabled={isPending}
          onClick={onCheckout}
          className="checkout-btn text-white/90 text-base"
        >
          {title}
          {isPending && <Loader2 className="animate-spin h-4 w-4 ml-2" />}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
