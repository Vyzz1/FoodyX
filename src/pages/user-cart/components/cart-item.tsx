import { useState } from "react";
import { Trash2, Plus, Minus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteService from "@/components/shared/delete-service";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAuth } from "@/hooks/useAuth";

interface CartItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelectChange: (id: string, isSelected: boolean) => void;
}

export default function CartItem({
  item,
  isSelected,
  onSelectChange,
}: CartItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const client = useQueryClient();

  //  client.invalidateQueries({
  //     queryKey: ["fetchData", "/cart"],
  //   });

  const axios = useAxiosPrivate({ type: "private" });
  const user = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (quantity: number) => {
      const response = await axios.patch(`/cart/quantity/${item.id}`, {
        quantity: quantity,
      });

      return response.data;
    },

    onMutate: async (quantity: number) => {
      await client.cancelQueries({
        queryKey: ["fetchData", "/cart", user.currentUser?.id.toString()],
      });

      const previousData = client.getQueryData<CartItem[]>([
        "fetchData",

        "/cart",

        user.currentUser?.id.toString(),
      ]);

      client.setQueryData<CartItem[]>(
        ["fetchData", "/cart", user.currentUser?.id.toString()],
        () => {
          return previousData?.map((cartItem) => {
            if (cartItem.id === item.id) {
              return {
                ...cartItem,
                subTotal: cartItem.basePrice * quantity,
                quantity: quantity,
              };
            }
            return cartItem;
          });
        }
      );

      return { previousData };
    },

    onError: (error, _, context) => {
      const message = (error as Error).message || "An error occurred";
      toast.error(message);
      client.setQueryData<CartItem[]>(
        ["fetchData", "/cart"],
        context?.previousData
      );
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: ["fetchData", "/cart"] });
    },
  });

  const handleIncrement = () => {
    mutate(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      mutate(item.quantity - 1);
    }
  };

  return (
    <Card
      className={`overflow-hidden px-4 border rounded-xl card-hover ${
        isSelected
          ? "border-amber-500 dark:border-amber-500"
          : "border-amber-200 dark:border-amber-900/50"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-x-3">
          <div className="flex items-start lg:justify-center py-4 pl-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelectChange(item.id, checked === true)
              }
              className="h-5 w-5 border-slate-500 dark:border-amber-300 data-[state=checked]:bg-amber-500 dark:data-[state=checked]:bg-amber-500"
            />
          </div>
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
              <DeleteService
                endpoint={`/cart/${item.id}`}
                queryKey="/cart"
                isTrigger={true}
              >
                <Button
                  disabled={isPending}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DeleteService>
            </div>

            <div className="mt-2">
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    disabled={item.quantity <= 1 || isPending}
                    variant="outline"
                    className="quantity-btn"
                    onClick={handleDecrement}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    className="quantity-btn"
                    onClick={handleIncrement}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
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
