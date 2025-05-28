import { ColumnDef } from "@tanstack/react-table";
import RowAction from "./row-action";
import { Clock1, StarIcon } from "lucide-react";
import ChangeActive from "./change-active";
import { DataTableColumnHeader } from "@/components/shared/serverside-column-header";

export const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "active",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          title="Active"
          column={column}
          paramKey="active"
        />
      );
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <ChangeActive id={row.original.id} isActive={isActive} />;
    },
  },
  {
    accessorKey: "timeEstimate",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          title="Time Est"
          column={column}
          paramKey="time"
        />
      );
    },
    cell: ({ row }) => {
      const timeEstimate = row.original.timeEstimate;
      return (
        <div className="flex items-center gap-2">
          <Clock1 className="text-amber-500 size-4" />
          <p className="text-xs max-w-[150px] truncate ">
            {timeEstimate} minutes
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "costPrice",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          title="Cost Price"
          column={column}
          paramKey="cost"
        />
      );
    },
    cell: ({ row }) => {
      const costPrice = row.original.costPrice;
      return (
        <p className="text-base text-red-500 font-semibold">
          {costPrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          title="Selling Price"
          column={column}
          paramKey="selling"
        />
      );
    },

    cell: ({ row }) => {
      const sellingPrice = row.original.sellingPrice;
      return (
        <p className="text-base text-red-500 font-semibold">
          {sellingPrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      );
    },
  },

  {
    accessorKey: "averageRating",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          title="Rating"
          column={column}
          paramKey="rating"
        />
      );
    },
    cell: ({ row }) => {
      const averageRating = row.original.averageRating;
      const totalRating = row.original.totalRating;
      return (
        <div className="flex flex-col gap-1">
          <p className="text-left text-slate-500 dark:text-slate-400">
            {totalRating} ratings
          </p>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <StarIcon
                key={item}
                className={`h-4 w-4 ${
                  item <= averageRating
                    ? "text-amber-500 fill-current"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "soldCount",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader title="Sold" column={column} paramKey="sold" />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <RowAction id={row.original.id} name={row.original.name} />;
    },
  },
];
