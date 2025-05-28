import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "@/components/shared/sidebar/nav-user";
import { Button } from "@/components/ui/button";

export default function AppSidebar({ items }: { items: SidebarItem[] }) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-background dark:bg-background"
    >
      <SidebarHeader className="px-4 flex flex-row items-center gap-x-2 py-2 bg-background dark:bg-background">
       <Link to={"/"} >
       <Button size={"icon"} variant={"ghost"}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

       </Link>
        <p>
          Homepage
        </p>

      </SidebarHeader>
      <SidebarContent className="bg-background dark:bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item?.subItems ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full bg-background dark:bg-background">
                          <div className="flex items-center">
                            <item.icon className="mr-4 h-4 w-4" />
                            <span className="text-foreground text-base">
                              {item.title}
                            </span>
                          </div>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className="bg-background dark:bg-background hover:bg-accent hover:text-accent-foreground"
                              >
                                <Link
                                  to={subItem.url as string}
                                  className="cursor-pointer"
                                >
                                  <subItem.icon className="mr-2 h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className="bg-background dark:bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link to={item.url as string} className="cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span className="text-foreground text-base">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-background dark:bg-background">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
