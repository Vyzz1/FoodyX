import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusVariant(status: string) {
  const variants: Record<OrderStatus, string> = {
    Pending: "warning",
    Processing: "info",
    Shipped: "default",
    Delivered: "success",
    Cancelled: "destructive",
  };
  return variants[status as OrderStatus] || "default";
}

export function getStatusClassName(status: string) {
  const statusMap: Record<string, string> = {
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    default: "border-gray-200 bg-gray-50 text-gray-800",
    success: "border-green-200 bg-green-50 text-green-800",
    destructive: "border-red-200 bg-red-50 text-red-800",
  };

  const variant = getStatusVariant(status);
  return statusMap[variant] || statusMap.default;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const getCategoryName = (categories: Category[], categoryId: string) => {
  const category = categories?.find((c: Category) => c.id === categoryId);
  return category ? category.name : "Unknown Category";
};

export const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
