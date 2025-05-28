import { DataTableColumnHeader } from "@/components/shared/serverside-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const paymentColumns: ColumnDef<PaymentHistory>[] = [
  {
    accessorKey: "paidAt",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Paid At"
          paramKey="paid"
        />
      );
    },
    cell: ({ row }) => {
      const { paidAt } = row.original;
      return (
        <div className="text-sm text-gray-500 dark:text-stone-100">
          {format(new Date(paidAt), "PPP")}
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Amount"
          paramKey="amount"
        />
      );
    },
    cell: ({ row }) => {
      const { amount } = row.original;
      return (
        <div className="text-sm text-amber-500 font-semibold">
          ${amount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const { paymentMethod } = row.original;
      return (
        <div className="text-sm text-slate-700 dark:text-stone-200  capitalize">
          {paymentMethod}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;

      return (
        <div>
          {status === "Failed" ? (
            <Badge variant="destructive" className="capitalize">
              {status}
            </Badge>
          ) : status === "Success" ? (
            <Badge
              variant={"default"}
              className="bg-green-500 hover:bg-green-600 capitalize"
            >
              {status}
            </Badge>
          ) : (
            <Badge variant="outline" className="capitalize">
              {status}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { orderId } = row.original;
      return (
        <div className="flex items-center gap-x-2">
          <Link
            to={`/order/${orderId}`}
            className="text-sm text-amber-500 hover:text-amber-600"
          >
            View Orders
          </Link>
        </div>
      );
    },
  },
];
