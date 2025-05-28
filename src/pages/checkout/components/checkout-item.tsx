import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CheckoutItemProps {
  item: CartItem;
}

export default function CheckoutItem({ item }: CheckoutItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`overflow-hidden px-4 border rounded-xl card-hover ${"border-amber-500 dark:border-amber-900/50"}`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-x-3">
          <div className="relative w-full sm:w-32 h-32 overflow-hidden">
            {item.menuItem.images && item.menuItem.images.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={item.menuItem.images[0] || "/placeholder.svg"}
                  alt={item.menuItem.name}
                  className="object-cover transition-transform duration-500 size-full rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-full h-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-500">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{item.menuItem.name}</h3>
            </div>

            <div className="mt-2">
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3">
                  <p className="hidden sm:block">Quantity</p>
                  <p className="text-amber-500 font-semibold">
                    x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-amber-500/95">
                    ${item.subTotal.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${item.basePrice.toFixed(2)} + $
                    {item.optionsPrice.toFixed(2)} options
                  </div>
                </div>
              </div>
            </div>

            {item.selectedOptionGroups &&
              item.selectedOptionGroups.length > 0 && (
                <div className="mt-3">
                  <button
                    className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
                    onClick={() => setIsExpanded(!isExpanded)}
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
                      {item.selectedOptionGroups.map((group) => (
                        <div key={group.id} className="text-sm">
                          <span className="font-medium">{group.name}: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {group.selectedOptions.map((option) => (
                              <Badge
                                key={option.id}
                                variant="outline"
                                className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                              >
                                {option.optionName}
                                {option.additionalPrice > 0 &&
                                  ` (+$${option.additionalPrice.toFixed(2)})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
