import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { Link, useNavigate } from "react-router-dom";
import AddressDisplay from "./components/address-display";
import CheckoutItem from "./components/checkout-item";
import useFetchData from "@/hooks/useFetchData";
import CheckoutSummary from "./components/checkout-summary";
import MobileCheckoutBar from "../../components/shared/mobile-checkout-bar";
import { useState } from "react";
import PaymentMethodDialog from "./components/payment-dialog";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { AmberLoading } from "@/components/shared/amber-loading";
import { useQueryClient } from "@tanstack/react-query";
import { AddressDialog } from "../user-address/components/address-dialog";
import useSetTitle from "@/hooks/useSetTitle";

export default function Checkout() {
  useSetTitle("Checkout Orders");
  const { cartItems, address } = useCheckout();

  const { data, isLoading, isError } = useFetchData("/address", "", "private");

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const navigator = useNavigate();

  function handleAddAddressSuccess() {
    toast.success("Address added successfully!");
    setIsOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["fetchData", "/address"],
    });
  }

  const queryClient = useQueryClient();
  const { mutate, isPending } = useSubmitData(
    "/order",
    (order: any) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "fetchData" &&
          query.queryKey[1] === "/order/me",
      });

      if (order?.payUrl) {
        window.location.href = order.payUrl;
      } else {
        toast.success("Order placed successfully!");
        queryClient.setQueryData([`fetchData`, `/order/${order.id}`], order);

        setTimeout(() => {
          navigator("/order/" + order.id, {
            replace: true,
          });
        }, 300);
      }
    },
    (erorr: any) => {
      const message = erorr?.response?.data?.message || "An error occurred.";
      toast.error(message);
    }
  );

  if (isError) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-center">
          Failed to load address, please try again later.
        </h2>
        <Link to={"/cart"}>
          <Button className="checkout-btn text-white">Go Back to Cart</Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.basePrice * item.quantity,
      0
    );

    const shippingFee = total > 50 ? 0 : 5.99;

    const data = {
      addressId: address,
      shippingFee,
      paymentMethod,
      orderItems: cartItems.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        unitPrice: item.basePrice,
        orderItemsOptions: item.selectedOptionGroups.flatMap((optionGroup) =>
          optionGroup.selectedOptions.map((option) => ({
            optionGroupId: optionGroup.id,
            optionItemId: option.id,
          }))
        ),
      })),
    };

    mutate({ data, type: "post" });
  };

  return (
    <section className="px-4 py-8 pb-24 md:pb-8">
      {isPending && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <AmberLoading size="lg" text="Placing Order..." />
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 max-w-xl border border-amber-300 rounded-3xl mx-auto">
            <h2 className="text-xl font-semibold">
              You didnt select anything to checkout !
            </h2>

            <div className="flex items-center gap-x-8 my-8 justify-center">
              <Link to={"/cart"}>
                <Button className="checkout-btn text-white">
                  Go Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-start scroll-m-2 text-amber-500">
              Checkout Page
            </h2>
            <div className="grid mt-12 grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
              <div className="flex flex-col  gap-8 lg:col-span-2">
                {isLoading ? (
                  <div>
                    <h2 className="text-xl font-semibold text-center">
                      Loading address...
                    </h2>
                  </div>
                ) : data.length === 0 ? (
                  <div className="w-full border border-amber-300 rounded-3xl mx-auto p-8 flex flex-col items-center justify-center gap-y-4">
                    <h2 className="text-xl font-semibold text-center">
                      No address found, please add an address to checkout.
                    </h2>

                    <Button
                      className="checkout-btn text-white"
                      onClick={() => setIsOpen(true)}
                      variant="outline"
                      size="lg"
                      type="button"
                      disabled={isPending}
                    >
                      Add Address
                      <span className="ml-2">+</span>
                    </Button>
                    <AddressDialog
                      open={isOpen}
                      onSuccess={handleAddAddressSuccess}
                      onOpenChange={setIsOpen}
                      title="Add Address"
                    />
                  </div>
                ) : (
                  <AddressDisplay addresses={data} />
                )}

                {cartItems.map((item) => (
                  <CheckoutItem key={item.id} item={item} />
                ))}
              </div>

              <div className=" flex-col gap-8 lg:col-span-1 hidden lg:flex">
                <CheckoutSummary
                  setPaymentOpen={setPaymentOpen}
                  payment={paymentMethod}
                  onCheckout={handleCheckout}
                  cartItems={cartItems}
                  total={cartItems.reduce(
                    (acc, item) =>
                      acc + item.basePrice * item.quantity + item.optionsPrice,
                    0
                  )}
                />
              </div>

              <MobileCheckoutBar
                isPending={isPending}
                isInCheckout={true}
                setPaymentOpen={setPaymentOpen}
                payment={paymentMethod}
                title="Place Order"
                total={cartItems.reduce(
                  (acc, item) => acc + item.basePrice * item.quantity,
                  0
                )}
                onCheckout={handleCheckout}
              />
            </div>
          </>
        )}

        <PaymentMethodDialog
          open={paymentOpen}
          setOpen={setPaymentOpen}
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
        />
      </div>
    </section>
  );
}
