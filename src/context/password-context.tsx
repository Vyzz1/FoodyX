import React, { createContext, useState } from "react";

type ForgotPasswordContextType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setExpiry: React.Dispatch<React.SetStateAction<string>>;
  expiry: string;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
};

const ForgotPasswordContext = createContext<ForgotPasswordContextType>({
  token: "",
  setToken: () => {},
  loading: false,
  setLoading: () => {},
  email: "",
  setEmail: () => {},
  setExpiry: () => {},
  expiry: "",
});

export default ForgotPasswordContext;

export const ForgotPasswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [expiry, setExpiry] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  return (
    <ForgotPasswordContext.Provider
      value={{
        token,
        setToken,
        loading,
        setLoading,
        expiry,
        setExpiry,
        email,
        setEmail,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};
