import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryTable } from "./components/category-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "./components/category-form";
import React from "react";
import useFetchData from "@/hooks/useFetchData";
import { AmberLoading } from "@/components/shared/amber-loading";
import useSetTitle from "@/hooks/useSetTitle";

export default function CategoryManagement() {
  useSetTitle("Category Management");
  const [open, setOpen] = React.useState(false);

  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchData("/category", "", "normal");

  if (isError) {
    return <div>Error loading categories</div>;
  }

  return (
    <div className="max-w-5xl px-4 mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="admin-title">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories here.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0">
            <CategoryForm setOpen={setOpen} isEditing={false} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <AmberLoading text="Loading categories..." size="md" />
        </div>
      ) : (
        <CategoryTable categories={categories} />
      )}
    </div>
  );
}
