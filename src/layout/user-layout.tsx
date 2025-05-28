import Header from "@/components/shared/header";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PersitentLogin from "./persitent-login";
import { useAuth } from "@/hooks/useAuth";
import { CheckoutProvider } from "@/context/checkout-context";

const UserLayout = () => {
  const { currentUser } = useAuth();

  const location = useLocation();

  if (!currentUser)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <PersitentLogin isInProtectedRoutes>
      <CheckoutProvider>
        <div className="antialiased">
          <Header />

          <main className="min-h-screen ">
            <Outlet />
          </main>
        </div>
      </CheckoutProvider>
    </PersitentLogin>
  );
};

export default UserLayout;
