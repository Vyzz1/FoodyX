import { Edit, EyeIcon, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import DeleteService from "@/components/shared/delete-service";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [open, setOpen] = React.useState(false);

  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);

  const columns: ColumnDef<Category>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Image",
      accessorKey: "imageUrl",
      cell: ({ row }) => {
        return (
          <img
            src={row.original.imageUrl}
            alt={row.original.name}
            className="aspect-square  h-20 rounded-2xl object-cover"
          />
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <DeleteService
          endpoint={`/category/${row.original.id}`}
          queryKey="/category"
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCategory(row.original);
                    setOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <EyeIcon />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DeleteService>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            A total of {categories.length} categories found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} filterInput="name" />
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <CategoryForm
            setOpen={setOpen}
            isEditing
            category={selectedCategory!}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
