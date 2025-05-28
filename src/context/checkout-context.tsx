import { createContext } from "react";
import React from "react";
interface CheckoutContextType {
  cartItems: Array<CartItem>;
  setCartItems: (items: CartItem[]) => void;
  totalPrice: number;
  shippingFee: number;
  address: string;
  setAddress: (address: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>({
  cartItems: [],
  setCartItems: () => {},
  totalPrice: 0,
  shippingFee: 0,
  address: "",
  setAddress: () => {},
});

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  const setCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  );

  const [address, setAddress] = React.useState<string>("");

  const updateAddress = (newAddress: string) => {
    setAddress(newAddress);
  };

  return (
    <CheckoutContext.Provider
      value={{
        cartItems,
        setCartItems: setCart,
        totalPrice,
        shippingFee: 0,
        address,
        setAddress: updateAddress,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;
