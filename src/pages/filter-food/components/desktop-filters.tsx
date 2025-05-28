// desktop-filter-ui.tsx
import { SearchInput } from "./search-input";
import { SortSelect } from "./sort-select";
import { RatingSelect } from "./rating-select";
import { PriceRangeFilter } from "./price-range-filter";
import { CategoryFilter } from "./category-filter";
import { ActiveFilters } from "./active-filters";
import useFetchData from "@/hooks/useFetchData";

interface DesktopFilterUIProps extends FilterProps {
  handleCategoryClick: (categoryId: string) => void;
  removeFilter: (type: string) => void;
  clearAllFilters: () => void;
  className?: string;
}

export function DesktopFilterUI({
  filterState,
  setFilterState,
  params,
  setParams,
  handleCategoryClick,
  removeFilter,
  clearAllFilters,
  className,
}: DesktopFilterUIProps) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchData("/category", "", "normal");

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c: Category) => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  if (isError) {
    return <div>Error loading categories</div>;
  }

  return (
    <div
      className={`hidden md:block bg-white rounded-lg shadow-sm p-4 border border-amber-100 dark:bg-neutral-900 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <SearchInput
          value={filterState.search || ""}
          onChange={(value) =>
            setFilterState({ ...filterState, search: value })
          }
        />

        <SortSelect
          value={filterState.sort || ""}
          onValueChange={(value) => {
            const newParams = new URLSearchParams(params.toString());

            if (value === "default") {
              newParams.delete("sort");
              value = "";
            } else {
              newParams.set("sort", value);
            }
            setParams(newParams);
            setFilterState({ ...filterState, sort: value });
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <RatingSelect
          value={filterState.rating || ""}
          onValueChange={(value) => {
            const newParams = new URLSearchParams(params.toString());

            if (value === "default") {
              newParams.delete("rating");
              value = "";
            } else {
              newParams.set("rating", value);
            }
            setParams(newParams);
            setFilterState({ ...filterState, rating: value });
          }}
        />

        <PriceRangeFilter
          fromPrice={filterState.fromPrice!}
          toPrice={filterState.toPrice!}
          onValueChange={(fromPrice, toPrice) => {
            setFilterState({
              ...filterState,
              fromPrice,
              toPrice,
            });
          }}
          onValueCommit={(fromPrice, toPrice) => {
            const newParams = new URLSearchParams(params.toString());
            newParams.set("fromPrice", fromPrice.toString());
            newParams.set("toPrice", toPrice.toString());
            setParams(newParams);
          }}
        />
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategoryIds={filterState.categoriesIds!}
        onCategoryClick={handleCategoryClick}
        isLoading={isLoading}
        className="mb-4"
      />

      <ActiveFilters
        filterState={filterState}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        getCategoryName={getCategoryName}
        className="pt-3 border-t border-amber-100"
      />
    </div>
  );
}
