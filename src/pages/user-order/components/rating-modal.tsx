import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import RatingForm from "./rating-form";
import React from "react";

interface RatingModalProps {
  order: OrderItem;
  visible: boolean;
setVisible : React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RatingModal({
  order,
  visible,
    setVisible,
}: RatingModalProps) {
  return (
    <>
      <Dialog open={visible} onOpenChange={setVisible}>
       

        <DialogContent className="lg:max-w-[700px]">
          <DialogTitle> 
            <div className="space-y-2">
              <h2 className="text-xl dark:text-amber-800  font-semibold text-amber-500 tracking-tight ">
                Rate your experience
              </h2>
              <p className="text-sm font-normal text-muted-foreground dark:text-amber-300">
                What do you think of our service? Your feedback is important to
                us.
              </p>
            </div>
          </DialogTitle>

          <div className="flex items-start gap-2 mt-4  ">
            <img
              src={order.avatar || "/placeholder.svg"}
              alt={order.menuItemName}
              className="object-cover size-28 rounded-sm border"
            />

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300">
                  {order.menuItemName}
                </h3>
             
                <p className="text-lg  text-amber-600 font-semibold dark:text-amber-300">
                  {formatCurrency(order.unitPrice)} × {order.quantity}
                </p>


              {order.orderItemOptions.length > 0 && (
                <div className="flex flex-row flex-wrap gap-1">
                  {order.orderItemOptions.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-md flex items-center gap-x-1 bg-amber-50 p-1.5 border border-amber-100 dark:bg-transparent dark:border-amber-700"
                    >
                      <p className=" text-xs font-medium ">
                        {option.optionItemName}
                      </p>
                      {option.additionalPrice > 0 && (
                        <span className=" text-xs text-amber-600 dark:text-black">
                            
                          +{formatCurrency(option.additionalPrice)}
                        </span>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

            <div className="mt-4flex justify-center ">
                <RatingForm orderId={order.id} menuItemId={order.menuItemId} onSuccess={()=>{
                    setVisible(false)
                }} />
            </div>
       
        </DialogContent>
      </Dialog>
    </>
  );
}
