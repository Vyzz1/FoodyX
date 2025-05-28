import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface OrderItemOption {
  id: string;
  optionGroupName: string;
  optionItemName: string;
  additionalPrice: number;
}

interface OrderItem {
  id: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  optionsPrice: number;
  totalPrice: number;
  avatar: string;
  orderItemOptions: OrderItemOption[];
}

interface OrderItemsProps {
  items: OrderItem[];
}

function groupOptionsByName(options: OrderItemOption[]) {
  return options.reduce((groups, option) => {
    const group = groups[option.optionGroupName] || [];
    group.push(option);
    groups[option.optionGroupName] = group;
    return groups;
  }, {} as Record<string, OrderItemOption[]>);
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <Card className="md:col-span-2 border-amber-100">
      <CardHeader className="pb-3 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Badge
            variant="outline"
            className="px-3 py-1 border-amber-200 bg-amber-50 text-amber-800"
          >
            {items.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {items.map((item, index) => {
            const groupedOptions = groupOptionsByName(item.orderItemOptions);

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
                        <h3 className="font-medium">{item.menuItemName}</h3>
                        <p className="text-lg my-2 text-amber-600 font-semibold  dark:text-amber-300  ">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>

                    <div className="mt-2 space-y-2">
                      {Object.entries(groupedOptions).map(
                        ([groupName, options]) => (
                          <div
                            key={groupName}
                            className="rounded-md bg-amber-50 p-2 border border-amber-100 dark:bg-transparent
                            
                            dark:border-amber-700"
                          >
                            <p className="mb-1 text-xs font-medium ">
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
                                      (+{formatCurrency(option.additionalPrice)}
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
    </Card>
  );
}
