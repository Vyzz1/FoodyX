import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PersitentLogin from "./persitent-login";
import Unauthorized from "./un-authorized";
import AppSidebar from "./app-sidebar";

interface AuthLayoutProps {
  allowedRole: string[];
  navItems: SidebarItem[];
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ allowedRole, navItems }) => {
  const { auth, currentUser } = useAuth();

  const location = useLocation();

  if (!currentUser)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <>
      {allowedRole.find((role) =>
        currentUser.role.toLowerCase().includes(role.toLowerCase())
      ) ? (
        <>
          <SidebarProvider>
            <AppSidebar items={navItems} />
            <SidebarInset>
              <main className="antialiased min-h-screen w-full">
                <PersitentLogin isInProtectedRoutes>
                  <SidebarTrigger />
                  <Outlet />
                </PersitentLogin>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </>
      ) : auth ? (
        <>
          <Unauthorized />
        </>
      ) : (
        <>
          <Navigate to="/login" replace state={{ from: location }} />
        </>
      )}
    </>
  );
};

export default AuthLayout;
