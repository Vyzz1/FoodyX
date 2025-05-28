import { CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodDialogProps {
  open: boolean;

  setPaymentMethod: (method: string) => void;

  paymentMethod: string;

  setOpen: (open: boolean) => void;
}

export default function PaymentMethodDialog({
  open,
  setPaymentMethod,
  paymentMethod,
  setOpen,
}: PaymentMethodDialogProps) {
  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-600 text-xl font-bold">
              Payment Method
            </DialogTitle>
            <DialogDescription>
              Select your preferred payment method to continue with your
              purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-amber-50 dark:hover:bg-accent transition-colors">
                <RadioGroupItem
                  value="stripe"
                  id="stripe"
                  className="border-amber-500 text-amber-500"
                />
                <Label
                  htmlFor="stripe"
                  className="flex flex-1 items-center gap-3 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium ">Credit Card (Stripe)</p>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your credit card
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-amber-50 dark:hover:bg-accent transition-colors">
                <RadioGroupItem
                  value="cod"
                  id="cod"
                  className="border-amber-500 text-amber-500"
                />
                <Label
                  htmlFor="cod"
                  className="flex flex-1 items-center gap-3 cursor-pointer"
                >
                  <Truck className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Pay when you receive your order
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              disabled={!paymentMethod}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
