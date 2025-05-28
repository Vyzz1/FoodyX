import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { createFormSchema } from "@/schema";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface AddToCartProps {
  optionGroups: OptionGroup[];
  basePrice?: number;

  menuItemId: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
  optionGroups,
  basePrice = 0,
  menuItemId,
}) => {
  const [quantity, setQuantity] = useState(1);
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const formSchema = createFormSchema(optionGroups);

  const createDefaultValues = (groups: OptionGroup[]) => {
    const defaultValues: Record<string, any> = {
      quantity: 1,
    };

    groups.forEach((group) => {
      defaultValues[group.id] = group.multiple ? [] : "";
    });

    return defaultValues;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(optionGroups),
  });

  const calculateTotalPrice = useCallback(() => {
    let subTotal = 0;

    const formValues = form.getValues();
    optionGroups.forEach(
      (group) => {
        const selectedOptions = formValues[group.id];

        if (group.multiple && Array.isArray(selectedOptions)) {
          selectedOptions.forEach((optionId) => {
            const option = group.options.find((opt) => opt.id === optionId);
            if (option) {
              subTotal += option.additionalPrice;
            }
          });
        } else if (selectedOptions) {
          const option = group.options.find(
            (opt) => opt.id === selectedOptions
          );
          if (option) {
            subTotal += option.additionalPrice;
          }
        }
      },
      [formValues, optionGroups]
    );

    return subTotal + basePrice * quantity;
  }, [form, quantity, optionGroups, basePrice]);

  const [totalPrice, setTotalPrice] = useState(() => calculateTotalPrice());

  const { currentUser } = useAuth();

  const handleOpen = (open: boolean) => {
    if (currentUser == null) {
      toast.info("Please login to add items to cart");
      return;
    }
    setOpen(open);
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
    const subscription = form.watch(() => {
      setTotalPrice(calculateTotalPrice());
    });

    return () => subscription.unsubscribe();
  }, [form, quantity, optionGroups, basePrice, calculateTotalPrice]);

  const { mutate, isPending } = useSubmitData(
    "/cart",
    () => {
      toast.success("Item added to cart successfully");

      queryClient.invalidateQueries({
        queryKey: ["fetchData", "/cart", currentUser?.id.toString()],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetchData", "/order/me"],
      });

      setOpen(false);
    },
    () => {
      toast.error("Failed to add item to cart");
    }
  );

  const onSubmit = (data: any) => {
    const { quantity, ...optionGroups } = data;

    const options = Object.entries(optionGroups).map(
      ([optionGroupId, values]) => ({
        optionGroupId,
        optionIds: Array.isArray(values) ? values.map((opt) => opt) : [values],
      })
    );

    const validOptions = options.filter(
      (option) => option.optionIds.length > 0
    );

    const formattedData = {
      quantity,
      menuItemId,
      options: validOptions,
    };

    mutate({ data: formattedData, type: "post" });
  };

  const FormContent = () => (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Customize Your Order</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newQuantity = Math.max(1, quantity - 1);
                  setQuantity(newQuantity);
                  form.setValue("quantity", newQuantity);
                }}
              >
                -
              </Button>
              <span className="mx-3">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newQuantity = quantity + 1;
                  setQuantity(newQuantity);
                  form.setValue("quantity", newQuantity);
                }}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t ">
            <span className="font-medium">Total Price:</span>
            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>

          {optionGroups
            .sort((a, b) => a.sequence - b.sequence)
            .map((group) => (
              <div className="space-y-3 border-t pt-4" key={group.id}>
                <div className="flex justify-between items-center">
                  <h4 className="text-amber-500 font-semibold">{group.name}</h4>
                  {group.required && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                      Required
                    </span>
                  )}
                  {group.multiple && (
                    <span className="text-sm dark:text-white text-gray-500">
                      Choose up to {group.freeLimit}
                    </span>
                  )}
                  {!group.required && !group.multiple && (
                    <span className="text-xs text-gray-500">Optional</span>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={group.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {group.multiple ? (
                          <div className="space-y-2">
                            {group.options
                              .sort((a, b) => a.sequence - b.sequence)
                              .map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      className="border-gray-200"
                                      id={`${group.id}-${option.id}`}
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = [
                                          ...(field.value || []),
                                        ];
                                        if (checked) {
                                          if (
                                            currentValue.length <
                                            group.freeLimit
                                          ) {
                                            field.onChange([
                                              ...currentValue,
                                              option.id,
                                            ]);
                                          }
                                        } else {
                                          field.onChange(
                                            currentValue.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`${group.id}-${option.id}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option.optionName}
                                    </label>
                                  </div>
                                  {option.additionalPrice > 0 && (
                                    <span className="text-sm text-gray-500 dark:text-emerald-100">
                                      +${option.additionalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-2"
                          >
                            {group.options
                              .sort((a, b) => a.sequence - b.sequence)
                              .map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      className="border-gray-200"
                                      value={option.id}
                                      id={`${group.id}-${option.id}`}
                                    />
                                    <label
                                      htmlFor={`${group.id}-${option.id}`}
                                      className="text-sm font-medium leading-none 
                                      
                                      peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option.optionName}
                                    </label>
                                  </div>
                                  {option.additionalPrice > 0 && (
                                    <span className="text-sm text-gray-500 dark:text-emerald-100">
                                      +${option.additionalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              ))}
                          </RadioGroup>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </form>
      </Form>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpen}>
        <DrawerTrigger asChild>
          <Button className="bg-amber-500 hover:bg-amber-600 transition-all duration-200 text-white/90">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <div className="overflow-y-auto max-h-[calc(85vh-40px)] custom-scrollbar ">
            <FormContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          className="bg-amber-500 hover:bg-amber-600 transition-all duration-200"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]  w-full overflow-y-scroll custom-scrollbar">
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default AddToCart;
