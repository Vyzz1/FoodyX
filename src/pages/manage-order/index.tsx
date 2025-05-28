import { AmberLoading } from "@/components/shared/amber-loading";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableServerSide } from "../../components/shared/data-table-serverside";
import { useSearchParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusClassName } from "@/lib/utils";
import { DataTableColumnHeader } from "../../components/shared/serverside-column-header";
import RowAction from "./components/row-action";
import DateRangeFilter from "../../components/shared/date-range-filter";
import ToolbarOrderFilter from "./components/toolbar-order-filter";
import useFetchData from "@/hooks/useFetchData";
import useSetTitle from "@/hooks/useSetTitle";
import OrderMetricsCards from "@/components/shared/order-cards";
const ManageOrder = () => {
  const [params] = useSearchParams();

  const queryKey = ["fetchData", `/order/admin?${params}`];

  useSetTitle("Manage Orders");
  const {
    data: orders,
    isLoading,
    isError,
  } = useFetchData(`/order/admin?${params}`, "", "private");

  if (isError) {
    return <div>Error loading orders</div>;
  }

  const columns: ColumnDef<UserOrder>[] = [
    {
      accessorKey: "orderDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          title="Order Date"
          column={column}
          paramKey="orderDate"
        />
      ),
      cell: ({ row }) => (
        <p className="text-muted-foreground text-sm">
          {format(new Date(row.original.orderDate), "PPP")}{" "}
        </p>
      ),
    },
    {
      accessorKey: "currentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader
          title="Status"
          column={column}
          paramKey="currentStatus"
        />
      ),
      cell: ({ row }) => {
        const { paymentMethod, payStatus } = row.original;

        const unPaid = paymentMethod !== "cod" && payStatus === "Failed";

        return (
          <div className="flex flex-col gap-2">
            <Badge
              variant={"outline"}
              className={getStatusClassName(row.original.currentStatus)}
            >
              {row.original.currentStatus}
            </Badge>

            {unPaid && (
              <Badge
                variant="outline"
                className="border-red-200 bg-red-500 text-white text-xs"
              >
                Unpaid
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => (
        <p className="text-slate-800 text-sm uppercase dark:text-amber-100">
          {row.original.paymentMethod}
        </p>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="text-slate-800 dark:text-amber-100 text-sm uppercase">
            {row.original.fullName}
          </p>
          <p className="text-slate-800 text-sm dark:text-amber-50">
            {row.original.phoneNumber}
          </p>
          <p className="text-muted-foreground text-sm truncate max-w-[200px]">
            {row.original.fullAddress}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader
          paramKey="total"
          title="Total Price"
          column={column}
        />
      ),
      cell: ({ row }) => (
        <p className="text-amber-600 font-medium">
          {formatCurrency(row.original.total)}
        </p>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.items.slice(0, 2).map((item) => (
            <div className="flex items-center gap-2" key={item.id}>
              <img
                src={item.avatar || "/placeholder.svg"}
                alt={item.menuItemName}
                className="object-cover size-10 hidden lg:block rounded-sm border "
              />
              <div key={item.id} className="flex items-center gap-2 text-sm">
                {item.menuItemName} x {item.quantity}
              </div>
            </div>
          ))}
          {row.original.items.length > 2 && (
            <p className="text-slate-900 text-xs ">
              and {row.original.items.length - 2} more items
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <RowAction
          currentStatus={row.original.currentStatus}
          queryKey={queryKey}
          id={row.original.id}
        />
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex lg:items-center justify-between mb-4 flex-col lg:flex-row items-start">
        <h1 className="admin-title">Manage Orders</h1>
        <DateRangeFilter />
      </div>

      <OrderMetricsCards isLoading={isLoading} orders={orders} />

      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <AmberLoading />
        </div>
      ) : (
        <>
          <ToolbarOrderFilter />
          <DataTableServerSide
            columns={columns}
            pagination={{
              isLast: orders.isLast,
              isPrevious: orders.isPrevious,
              isNext: orders.isNext,
              totalPages: orders.totalPages,
              currentPage: orders.currentPage,
              totalCount: orders.totalCount,
              limit: orders.pageSize,
            }}
            data={orders.content}
          />
        </>
      )}
    </div>
  );
};

export default ManageOrder;
