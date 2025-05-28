declare type SidebarItem = {
  title: string;
  url?: string;
  icon: React.ElementType;
  subItems?: SidebarItem[];
};

declare type User = {
  id: string;
  fullName: string;
  role?: string;
  photoUrl: string;
  gender: "male" | "female" | "other";
  email: string;
  dateOfBirth?: Date;
  phoneNumber: string;
};

declare type CurrentUserType = {
  photoUrl: string;
  name: string;
  id: number;
  role: string;
  email: string;
};

declare type UserAddress = {
  id: string;
  fullAddress: string;
  phoneNumber: string;
  specificAddress: string;
  fullName: string;
  isDefault: boolean;
};

declare type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Option {
  id: string;
  optionName: string;
  additionalPrice: number;
  sequence: number;
}

interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  freeLimit: number;
  options: Option[];
  sequence: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  images: string[];
  category: Category;
  optionGroups: OptionGroup[];
  isActive: boolean;
  timeEstimate: number;
  soldCount: number;
  averageRating: number;
  totalRating: number;
}

interface OptionGroupCart {
  id: string;
  name: string;

  selectedOptions: OptionItemCart[];
}

interface OptionItemCart {
  id: string;
  optionName: string;
  additionalPrice: number;
}

interface CartItem {
  id: string;
  quantity: number;
  menuItem: MenuItem;
  basePrice: number;
  optionsPrice: number;
  subTotal: number;
  selectedOptionGroups: OptionGroupCart[];
}

type Theme = "dark" | "light" | "system";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItemOption {
  id: string;
  optionGroupName: string;
  optionItemName: string;
  additionalPrice: number;
}

interface OrderItem {
  id: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  optionsPrice: number;
  totalPrice: number;
  avatar: string;
  orderItemOptions: OrderItemOption[];
  menuItemId: string;
  isRated: boolean;
}

interface UserOrder {
  id: string;
  orderDate: string;
  currentStatus: OrderStatus;
  paymentMethod: string;
  total: number;
  subTotal: number;
  specificAddress: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  shippingFee: number;
  payStatus: "Failed" | "Success";
  statusHistory: {
    id: string;
    status: OrderStatus;
    changedAt: string;
  }[];

  items: OrderItem[];
}

type FoodFilter = {
  search?: string | null;
  categoriesIds?: string[] | null;
  page?: number;
  limit?: number;
  fromPrice?: number | null;
  toPrice?: number | null;
  sort?: string | null;
  rating?: string | null;
};

interface PriceRangeFilterProps {
  fromPrice: number;
  toPrice: number;
  onValueChange: (fromPrice: number, toPrice: number) => void;
  onValueCommit?: (fromPrice: number, toPrice: number) => void;
  className?: string;
  isPopover?: boolean;
}

interface FilterProps {
  filterState: FoodFilter;
  setFilterState: React.Dispatch<React.SetStateAction<FoodFilter>>;
  params: URLSearchParams;
  setParams: (params: URLSearchParams) => void;
}

interface ReviewResponse {
  content: string;
  images: string[];
  rating: number;
  menuItemId: string;
  orderItemId: string;
  user: User;
  optionItemNames: string[];

  createdAt: Date;
}

type UserAdmin = User & {
  createdAt: Date;
  phoneNumber: string;
  emailVerified: boolean;
  lockoutEnd: Date | null;
};

type PaymentHistory = {
  id: string;
  orderId: string;
  paymentMethod: string;
  amount: number;
  status: string;
  paidAt: Date;
  user: User;
};
