import CheckoutContext from "@/context/checkout-context";
import React from "react";

export const useCheckout = () => {
  const context = React.useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
