import {
  ContactRoundIcon,
  CreditCard,
  LayoutDashboard,
  List,
  Pizza,
  SquareTerminal,
  TableProperties,
  UserIcon,
} from "lucide-react";

export const adminNavItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Orders",
    url: "manage-orders",
    icon: SquareTerminal,
  },
  {
    title: "Mange Users",
    url: "manage-users",
    icon: UserIcon,
  },
  {
    title: "Manage All Dishes",
    url: "dishes",
    icon: Pizza,
  },
  {
    title: "Manage Categories",
    url: "category",
    icon: List,
  },
  {
    title: "Payments",
    url: "manage-payments",
    icon: CreditCard,
  },
];

export const userNavItems: SidebarItem[] = [
  {
    title: "Information",
    url: "information",
    icon: UserIcon,
  },
  {
    title: "History Payment",
    url: "history-payment",
    icon: CreditCard,
  },

  {
    title: "Order",
    url: "orders",
    icon: TableProperties,
  },
  {
    title: "Manage Address",
    url: "address",
    icon: ContactRoundIcon,
  },
];
