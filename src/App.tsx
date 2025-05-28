import LoginPage from "./pages/login";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/sign-up";
import ForgotPassword from "./pages/forgot-password";
import AuthLayout from "./layout/auth-layout";
import { adminNavItems, userNavItems } from "./data";
import VerifyAccount from "./pages/verify-account";
import UserAccount from "./pages/account";
import ChangePasword from "./pages/change-password";
import ChangeAvatar from "./pages/change-avatar";
import UserAddress from "./pages/user-address";
import CategoryManagement from "./pages/category-management";
import DishForm from "./pages/dishes-form";
import DishManagement from "./pages/dish-management";
import EditDish from "./pages/dish-management/edit-dish";
import LayoutDefault from "./layout/layout-default";
import DishDetails from "./pages/dish-details";
import UserLayout from "./layout/user-layout";
import UserCart from "./pages/user-cart";
import Checkout from "./pages/checkout";
import OrderDetails from "./pages/order-details";
import UserOrder from "./pages/user-order";
import ManageUser from "./pages/manage-user";
import ManageOrder from "./pages/manage-order";
import FilterFood from "./pages/filter-food";
import DishReviews from "./pages/dish-reviews";
import OrderModal from "./pages/order-modal";
import SuccessPayment from "./pages/pay/success";
import CancelPayment from "./pages/pay/cancle";
import ManagePayment from "./pages/manage-payment";
import Dashboard from "./pages/dashboard";
import UserPayments from "./pages/user-payments";
import Homepage from "./pages/homepage";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import UploadImages from "./pages/update-image";
import NotFoundPage from "./components/shared/_404";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-account",
      element: <VerifyAccount />,
    },
    {
      path: "/test",
      element: <DishForm isEdit={false} />,
    },

    {
      element: <LayoutDefault />,
      children: [
        {
          path: "/filter-food",
          element: <FilterFood />,
        },
        {
          path: "dish/:id",
          element: <DishDetails />,
        },
        {
          path: "dish/:id/reviews",
          element: <DishReviews />,
        },
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
      ],
    },
    {
      element: <UserLayout />,
      children: [
        {
          path: "cart",
          element: <UserCart />,
        },

        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "order/:id",
          element: <OrderDetails />,
        },
        {
          path: "pay/success",
          element: <SuccessPayment />,
        },
        {
          path: "pay/cancel",
          element: <CancelPayment />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AuthLayout allowedRole={["Admin"]} navItems={adminNavItems} />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "category",
          element: <CategoryManagement />,
        },
        {
          path: "dishes",
          element: <DishManagement />,
          children: [
            {
              path: ":id/orders",
              element: (
                <OrderModal apiEndpoint="order/food" backTo="/admin/dishes" />
              ),
            },
          ],
        },
        {
          path: "dishes/edit/:id",
          element: <EditDish />,
        },
        {
          path: "dishes/:id/update-image",
          element: <UploadImages />,
        },
        {
          path: "dishes/create",
          element: <DishForm isEdit={false} />,
        },
        {
          path: "manage-payments",
          element: <ManagePayment />,
        },
        {
          path: "manage-users",
          element: <ManageUser />,
          children: [
            {
              path: ":id/orders",
              element: (
                <OrderModal
                  apiEndpoint="order/user"
                  backTo="/admin/manage-users"
                />
              ),
            },
          ],
        },
        {
          path: "manage-orders",
          element: <ManageOrder />,
        },
        {
          path: "change-password",
          element: <ChangePasword />,
        },
      ],
    },
    {
      path: "/user",
      element: (
        <AuthLayout allowedRole={["Customer"]} navItems={userNavItems} />
      ),
      children: [
        {
          index: true,
          element: <UserAccount />,
        },
        {
          path: "history-payment",
          element: <UserPayments />,
        },
        {
          path: "information",
          element: <UserAccount />,
        },
        {
          path: "change-password",
          element: <ChangePasword />,
        },
        {
          path: "change-avatar",
          element: <ChangeAvatar />,
        },
        {
          path: "address",
          element: <UserAddress />,
        },
        {
          path: "orders",
          element: <UserOrder />,
        },
      ],
    },

    {
      path: "*",
      element: (
        <>
          <NotFoundPage />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
