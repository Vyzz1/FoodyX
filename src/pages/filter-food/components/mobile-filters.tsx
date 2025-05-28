import useFetchData from "@/hooks/useFetchData";
import React from "react";
import { SearchInput } from "./search-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { SortSelect } from "./sort-select";
import { RatingSelect } from "./rating-select";
import { PriceRangeFilter } from "./price-range-filter";
import { Separator } from "@/components/ui/separator";
import { ActiveFilters } from "./active-filters";
import { CategoryFilter } from "./category-filter";
import { cn } from "@/lib/utils";

interface MobileFilterUIProps extends FilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  applyFilters: () => void;
  clearAllFilters: () => void;
  removeFilter: (type: string) => void;
  className?: string;
  filterState: FoodFilter;
}

const MobileFilters: React.FC<MobileFilterUIProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  applyFilters,
  filterState,
  setFilterState,
  clearAllFilters,
  removeFilter,

  className,
}) => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchData("/category", "", "normal");

  if (isError) {
    return <div>Error loading categories</div>;
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c: Category) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className={cn("md:hidden flex items-center gap-2 mb-0", className)}>
      <div className="relative flex-1  items-center">
        <SearchInput
          value={filterState.search || ""}
          onChange={(value) =>
            setFilterState({ ...filterState, search: value })
          }
        />
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="icon"
            className="border-amber-200 hover:border-amber-300"
          >
            <FilterIcon className="h-4 w-4 text-amber-500" />
            <span className="sr-only">Open filters</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="  overflow-y-auto px-4">
          <SheetHeader className="mb-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Refine your search with these filters
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sort by</h3>
              <SortSelect
                onValueChange={(value) => {
                  if (value === "default") value = "";
                  setFilterState({ ...filterState, sort: value });
                }}
                value={filterState.sort || ""}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rating</h3>
              <RatingSelect
                value={filterState.rating || ""}
                onValueChange={(value) => {
                  if (value === "default") value = "";
                  setFilterState({ ...filterState, rating: value });
                }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Price Range</h3>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-600 font-medium">
                    ${filterState.fromPrice} - ${filterState.toPrice}
                  </span>
                </div>
                <PriceRangeFilter
                  isPopover={false}
                  fromPrice={filterState.fromPrice!}
                  toPrice={filterState.toPrice!}
                  onValueChange={(fromPrice, toPrice) => {
                    setFilterState({
                      ...filterState,
                      fromPrice,
                      toPrice,
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Categories</h3>
              <CategoryFilter
                categories={categories}
                isLoading={isLoading}
                selectedCategoryIds={filterState.categoriesIds!}
                onCategoryClick={(categoryId) => {
                  const updatedIds = filterState.categoriesIds?.includes(
                    categoryId
                  )
                    ? filterState.categoriesIds?.filter(
                        (id) => id !== categoryId
                      )
                    : [...filterState.categoriesIds!, categoryId];

                  setFilterState({
                    ...filterState,
                    categoriesIds: updatedIds,
                  });
                }}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <ActiveFilters
            getCategoryName={getCategoryName}
            filterState={filterState}
            removeFilter={removeFilter}
            clearAllFilters={clearAllFilters}
          />

          <SheetFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterState({
                  search: "",
                  sort: "",
                  rating: "",
                  fromPrice: 0,
                  toPrice: 100,
                  categoriesIds: [],
                });
              }}
            >
              Reset
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilters;
