import { AmberLoading } from "@/components/shared/amber-loading";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import { PlusIcon } from "lucide-react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { DataTableServerSide } from "@/components/shared/data-table-serverside";
import { columns } from "./components/dish-columns";
import ToolbarFoodFilter from "./components/toolbar-dish-filter";
import useSetTitle from "@/hooks/useSetTitle";

const DishManagement = () => {
  useSetTitle("Dish Management");
  const [params] = useSearchParams();
  const {
    data: dishes,
    isLoading,
    isError,
  } = useFetchData(`/food?${params}`, "", "private");

  const navigator = useNavigate();

  if (isError) {
    return <div>Error loading dishes.</div>;
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="admin-title">Dish Management</h2>
            <p className="text-muted-foreground text-sm">
              Manage your dishes here.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              navigator("/admin/dishes/create");
            }}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            <PlusIcon className="mr-2" /> Create New Dish
          </Button>
        </div>

        {isLoading ? (
          <div>
            <AmberLoading text="Loading dishes..." size="md" />
          </div>
        ) : (
          <>
            <ToolbarFoodFilter />
            <DataTableServerSide
              pagination={{
                isLast: dishes.isLast,
                isPrevious: dishes.isPrevious,
                isNext: dishes.isNext,
                totalPages: dishes.totalPages,
                currentPage: dishes.currentPage,
                totalCount: dishes.totalCount,
                limit: dishes.pageSize,
              }}
              columns={columns}
              data={dishes.content}
            />
          </>
        )}
      </div>
      <Outlet />
    </section>
  );
};

export default DishManagement;
