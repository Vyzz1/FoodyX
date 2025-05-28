import { DataTableColumnHeader } from "@/components/shared/serverside-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { RowActions } from "./row-action";
import clsx from "clsx";
import { XIcon } from "lucide-react";

export const columns: ColumnDef<UserAdmin>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        title="Created At"
        column={column}
        paramKey="createdAt"
      />
    ),
    cell: ({ row }) => (
      <p className="text-muted-foreground text-sm">
        {format(new Date(row.original.createdAt), "PPP")}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader title="Email" column={column} paramKey="email" />
    ),
    cell: ({ row }) => {
      const isBanned = !!row.original.lockoutEnd;

      return (
        <p
          className={clsx("  text-sm", {
            "line-through text-red-500 dark:text-red-500": isBanned,
            "text-slate-800 dark:text-stone-100": !isBanned,
          })}
        >
          {row.original.email}
        </p>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader
        title="Full Name"
        column={column}
        paramKey="name"
      />
    ),

    cell: ({ row }) => {
      const isBanned = !!row.original.lockoutEnd;
      return (
        <div className="flex items-center space-x-1.5">
          {!isBanned ? (
            <Avatar>
              <AvatarFallback>
                {row.original.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={row.original.photoUrl}
                alt={row.original.fullName}
              />
            </Avatar>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white">
              <XIcon className="text-white" size={20} />
            </div>
          )}
          <div className="flex flex-col leading-none space-y-2">
            <p
              className={clsx("text-sm font-medium leading-none", {
                "line-through text-red-500 dark:text-red-500": isBanned,
                "text-slate-800 dark:text-stone-100": !isBanned,
              })}
            >
              {row.original.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.phoneNumber}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    header: "Infor",
    accessorKey: "gender",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-slate-800 capitalize dark:text-stone-100 text-sm">
          {row.original.gender}
        </p>

        <p className="text-slate-800 dark:text-stone-100 text-sm">
          {format(new Date(row.original.dateOfBirth!), "PPP")}
        </p>
      </div>
    ),
  },
  {
    header: "Email Verified",
    accessorKey: "emailVerified",
    cell: ({ row }) => (
      <p className="text-amber-500 text-sm font-bold">
        {row.original.emailVerified ? "Yes" : "No"}
      </p>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <RowActions isBanned={!!row.original.lockoutEnd} id={row.original.id} />
    ),
  },
];
