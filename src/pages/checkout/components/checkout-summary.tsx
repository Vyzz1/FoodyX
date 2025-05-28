import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import ChoosePayment from "./choose-payment";

interface CheckoutSummary {
  cartItems: CartItem[];
  total: number;

  onCheckout: () => void;

  setPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  payment: string;
}

export default function CheckoutSummary({
  cartItems,
  total,
  onCheckout,
  setPaymentOpen,
  payment,
}: CheckoutSummary) {
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  return (
    <Card className="border border-amber-400 dark:border-amber-900/50 rounded-xl sticky top-4 overflow-hidden">
      <div className="amber-gradient h-2 w-full"></div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-slate-950 tracking-tight dark:text-slate-200">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-950 dark:text-white  font-semibold">
            Items ({itemCount})
          </span>
          <span className="text-amber-400 font-semibold text-base">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-950 font-semibold dark:text-white ">
            Shipping
          </span>
          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <Separator className="bg-amber-100 dark:bg-amber-800/30" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>

        <ChoosePayment setPaymentOpen={setPaymentOpen} payment={payment} />
      </CardContent>
      <CardFooter>
        <button className="w-full checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </CardFooter>
    </Card>
  );
}
