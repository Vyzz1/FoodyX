import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

interface ChoosePaymentProps {
  setPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  payment: string;
  className?: string;
}

export default function ChoosePayment({
  setPaymentOpen,
  payment,
  className,
}: ChoosePaymentProps) {
  return (
    <div className={cn("flex justify-between ", className)}>
      <span>Payment Method</span>

      <div
        className="px-3 py-1 border dark:border-emerald-200 border-slate-600/20 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition-colors"
        onClick={() => setPaymentOpen(true)}
      >
        <span className="text-amber-400 text-sm font-semibold">
          {payment.toUpperCase()}
        </span>

        <ArrowDown className="h-4 w-4 text-amber-400" />
      </div>
    </div>
  );
}
