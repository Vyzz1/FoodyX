import { AlignLeft, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ToggleTheme } from "./toggle-theme";
import UserNav from "./user-nav";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PersitentLogin from "@/layout/persitent-login";

const Header = () => {
  const { currentUser } = useAuth();

  const isLogin = currentUser !== null && currentUser !== undefined;
  const pageNavigation = (
    <>
      <h1 className="text-lg md:hidden cursor-pointer font-semibold text-primary">
        FoodyX
      </h1>

      <Link to={"/"} className="header-link">
        Home
      </Link>

      <Link to={"/about"} className="header-link active:text-blue-300 ">
        About
      </Link>
      <Link to={"/contact"} className="header-link">
        Contact
      </Link>
      <Link to={"/filter-food"} className="header-link">
        Find Foods
      </Link>
    </>
  );

  return (
    <header className="w-full flex bg-white dark:bg-[#09111f] shadow-sm items-center  justify-between py-4 px-8 ">
      <h1 className="text-lg hidden md:block cursor-pointer font-semibold text-primary">
        FoodyX
      </h1>
      <nav className="space-x-4 hidden md:flex">{pageNavigation}</nav>

      <Sheet>
        <SheetTrigger className="md:hidden">
          <AlignLeft className="size-6 md:hidden text-muted-foreground" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-y-5 px-4 py-4">
            {pageNavigation}
          </div>
        </SheetContent>
      </Sheet>

      <div className=" space-x-4 items-center flex">
        <ToggleTheme />

        {!isLogin ? (
          <>
            <Link to={"/login"} className="header-link ">
              <Button className="bg-amber-500/90 text-white hover:bg-amber-700">
                Login
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to={"/cart"} className="header-link">
              <Button size="icon" variant="outline">
                <ShoppingCart className="size-4 text-muted-foreground dark:text-white" />
              </Button>
            </Link>
            <PersitentLogin
              isInProtectedRoutes={false}
              className="h-fit"
              isSmallScreen
            >
              <UserNav
                user={{
                  avatar: currentUser?.photoUrl,
                  name: currentUser?.name,
                  email: currentUser?.email,
                  role: currentUser?.role,
                }}
              />
            </PersitentLogin>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
