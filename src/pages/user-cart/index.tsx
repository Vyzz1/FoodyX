import { useState, useCallback } from "react";
import { AmberLoading } from "@/components/shared/amber-loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useFetchData from "@/hooks/useFetchData";
import { ShoppingCart } from "lucide-react";
import CartItem from "./components/cart-item";
import CartSummary from "./components/cart-summary";
import MobileCheckoutBar from "../../components/shared/mobile-checkout-bar";
import { toast } from "sonner";
import { useCheckout } from "@/hooks/use-checkout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import useSetTitle from "@/hooks/useSetTitle";

const UserCart = () => {
  const user = useAuth();

  useSetTitle("Your shopping cart");

  const {
    data: cart,
    error,
    isLoading,
  } = useFetchData("/cart", user.currentUser?.id.toString(), "private");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemSelection = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cart.map((item: CartItem) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const getSelectedCartItems = useCallback(() => {
    return cart.filter((item: CartItem) => selectedItems.includes(item.id));
  }, [cart, selectedItems]);

  const calculateTotal = useCallback(() => {
    return getSelectedCartItems().reduce((total: number, item: CartItem) => {
      return total + item.subTotal * item.quantity;
    }, 0);
  }, [getSelectedCartItems]);

  const areAllItemsSelected =
    cart?.length > 0 && selectedItems.length === cart.length;

  const { setCartItems } = useCheckout();

  const navigate = useNavigate();

  const handleCheckout = () => {
    const items = getSelectedCartItems();

    if (items.length === 0) {
      toast.info("Please select at least one item to checkout", {
        description: "You can select items from your cart to proceed.",
        duration: 1000,
      });
      return;
    }

    setCartItems(items);

    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AmberLoading text="Loading cart..." size="md" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading cart</div>;
  }

  return (
    <section className="px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg shadow-md">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl text-slate-800 font-semibold dark:text-white tracking-tight">
              Your Cart
            </h1>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-transparent rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/50">
            <div className="bg-amber-100 dark:bg-amber-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <Button
              onClick={() => navigate("/filter-food")}
              className="bg-amber-500 hover:bg-amber-600 shadow-md"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between mb-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={areAllItemsSelected}
                    onCheckedChange={handleSelectAll}
                    className="h-5 w-5 border-amber-400 data-[state=checked]:bg-amber-500"
                  />
                  <span className="font-medium">Select All Items</span>
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  {selectedItems.length} of {cart.length} selected
                </div>
              </div>

              <div className="space-y-4">
                {cart.map((item: CartItem) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelectChange={handleItemSelection}
                  />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 hidden md:block">
              <CartSummary
                handleCheckout={handleCheckout}
                cartItems={getSelectedCartItems()}
                total={calculateTotal()}
              />
            </div>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <MobileCheckoutBar
          title="Checkout"
          total={calculateTotal()}
          onCheckout={handleCheckout}
        />
      )}
    </section>
  );
};

export default UserCart;
