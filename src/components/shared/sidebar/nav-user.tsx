import {
  BadgeCheck,
  ChevronsUpDown,
  Lock,
  LogOut,
  Monitor,
  MoonIcon,
  Palette,
  PictureInPictureIcon,
  SunIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { useTheme } from "@/layout/theme-provider";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const logout = useLogout();

  const { theme: currentTheme, setTheme } = useTheme();

  const iconThemeClassName = (theme: Theme) => {
    let className = "size-4 mr-2 h-4 w-4";

    if (currentTheme === theme) {
      className += " text-amber-500";
    }

    return className;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={currentUser?.photoUrl || "/bg-none.jpg"}
                  alt={currentUser?.name}
                />
                <AvatarFallback className="rounded-lg">KV</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate  font-light">
                  {currentUser?.name}
                </span>
                <span className="truncate text-xs">{currentUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={currentUser?.photoUrl || "/bg-none.jpg"}
                    alt={currentUser?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser?.name}
                  </span>
                  <span className="truncate text-xs">{currentUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {currentUser?.role !== "admin" && (
                <>
                  <DropdownMenuItem onClick={() => navigate("information")}>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem onClick={() => navigate("change-avatar")}>
                    <PictureInPictureIcon />
                    <span>Change Profile Picture</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="size-4 mr-2" />
                  Change theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="ml-3">
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className={
                        currentTheme === "dark" ? "text-amber-300" : ""
                      }
                    >
                      <SunIcon className={iconThemeClassName("dark")} />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className={
                        currentTheme === "light" ? "text-amber-500" : ""
                      }
                    >
                      <MoonIcon className={iconThemeClassName("light")} />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={
                        currentTheme === "system" ? "text-amber-500" : ""
                      }
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className={iconThemeClassName("system")} />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* 
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <div className="flex items-center gap-1 rounded-md border p-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <SunIcon className="h-4 w-4" />
                    <span className="sr-only">Light</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoonIcon className="h-4 w-4" />
                    <span className="sr-only">Dark</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Monitor className="h-4 w-4" />
                    <span className="sr-only">System</span>
                  </Button>
                </div>
              </div> */}

              <DropdownMenuItem onClick={() => navigate("change-password")}>
                <Lock />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
