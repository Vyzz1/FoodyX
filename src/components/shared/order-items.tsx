import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { cn, getStatusClassName } from "@/lib/utils";
import RatingSelection from "../../pages/user-order/components/rating-selection";
import RepayButton from "./repay-button";

interface OrderItemsProps {
  items: OrderItem[];
  orderDate: string;
  currentStatus: string;
  onViewDetails?: () => void;
  isAdmin?: boolean;
  orderId?: string;
  shouldRepay: boolean;
}

function groupOptionsByName(options: OrderItemOption[]) {
  return options.reduce((groups, option) => {
    const group = groups[option.optionGroupName] || [];
    group.push(option);
    groups[option.optionGroupName] = group;
    return groups;
  }, {} as Record<string, OrderItemOption[]>);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function OrderItems({
  items,
  orderDate,
  currentStatus,
  onViewDetails,
  isAdmin = false,
  orderId,
  shouldRepay,
}: OrderItemsProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <Card className="md:col-span-2 border-amber-100">
      <CardHeader className="pb-3 border-b border-amber-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <h2 className="text-base">
                {format(new Date(orderDate), "dd/MM/yyyy HH:mm")}
              </h2>
              <Badge
                variant="outline"
                className=" border-amber-200 bg-amber-50 text-amber-800 text-xs"
              >
                {items.length} items
              </Badge>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                getStatusClassName(currentStatus),
                "px-3 py-1 text-sm font-medium"
              )}
            >
              {currentStatus}
            </Badge>
            {!isAdmin && shouldRepay && <RepayButton orderId={orderId!} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {items.map((item, index) => {
            const groupedOptions = groupOptionsByName(item.orderItemOptions);
            const hasOptions = item.orderItemOptions.length > 0;
            const isExpanded = expandedItems[item.id] || false;

            return (
              <div key={item.id} className="animate-in fade-in-50 duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={item.avatar || "/placeholder.svg"}
                      alt={item.menuItemName}
                      className="object-cover size-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-x-1.5">
                          <h3 className="font-medium">{item.menuItemName}</h3>
                          {item.isRated && (
                            <Badge
                              variant="outline"
                              className="border-amber-200 bg-amber-50 text-amber-800 text-xs"
                            >
                              Rated
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg my-2 text-amber-600 font-semibold dark:text-amber-300">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>

                    {hasOptions && (
                      <div className="mt-2">
                        <button
                          className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <span className="mr-1">
                            {isExpanded ? "Hide options" : "Show options"}
                          </span>
                          <ChevronDown
                            className="text-xs size-4 transition-transform duration-300"
                            style={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-2 animate-in fade-in-50 duration-300">
                            {Object.entries(groupedOptions).map(
                              ([groupName, options]) => (
                                <div
                                  key={groupName}
                                  className="rounded-md bg-amber-50 p-2 border border-amber-100 dark:bg-transparent dark:border-amber-700"
                                >
                                  <p className="mb-1 text-xs font-medium">
                                    {groupName}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((option) => (
                                      <Badge
                                        key={option.id}
                                        variant="outline"
                                        className="bg-white border-amber-200 dark:bg-emerald-50 dark:text-amber-600 font-semibold"
                                      >
                                        {option.optionItemName}
                                        {option.additionalPrice > 0 && (
                                          <span className="ml-1 text-amber-600 dark:text-black">
                                            (+
                                            {formatCurrency(
                                              option.additionalPrice
                                            )}
                                            )
                                          </span>
                                        )}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {index < items.length - 1 && (
                  <Separator className="my-4 bg-amber-100" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className=" justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-amber-200 hover:bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          onClick={onViewDetails}
        >
          View Details
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>

        {!isAdmin &&
          currentStatus === "Delivered" &&
          !items.every((v) => v.isRated) && (
            <RatingSelection orderItems={items} />
          )}

        {items.every((v) => v.isRated) && (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-800 text-xs"
          >
            Rated all
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
