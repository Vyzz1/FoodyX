// active-filters.tsx
import { Button } from "@/components/ui/button";
import { FilterBadge } from "./filter-badge";

interface ActiveFiltersProps {
  filterState: FoodFilter;
  removeFilter: (type: string) => void;
  clearAllFilters: () => void;
  getCategoryName?: (id: string) => string;
  className?: string;
  compact?: boolean;
}

export function ActiveFilters({
  filterState,
  removeFilter,
  clearAllFilters,
  getCategoryName,
  className,
  compact = false,
}: ActiveFiltersProps) {
  const isActiveFilter =
    filterState.search ||
    filterState.sort ||
    filterState.rating ||
    filterState.fromPrice !== 0 ||
    filterState.toPrice !== 100 ||
    filterState.categoriesIds!.length > 0;

  if (!isActiveFilter) return null;

  if (compact) {
    return (
      <div
        className={`flex overflow-x-auto pb-2 w-full gap-2 no-scrollbar ${className}`}
      >
        {filterState.categoriesIds!.length > 0 && (
          <FilterBadge
            label="Categories"
            value={filterState.categoriesIds!.length.toString()}
            onRemove={() => removeFilter("category")}
          />
        )}

        {filterState.sort && (
          <FilterBadge
            label="Sort"
            value={filterState.sort
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            onRemove={() => removeFilter("sort")}
          />
        )}

        {filterState.rating && (
          <FilterBadge
            label="Rating"
            value={filterState.rating.replace(/_/g, " ").toLowerCase()}
            onRemove={() => removeFilter("rating")}
          />
        )}

        {(filterState.fromPrice !== 0 || filterState.toPrice !== 100) && (
          <FilterBadge
            label="Price"
            value={`$${filterState.fromPrice} - $${filterState.toPrice}`}
            onRemove={() => removeFilter("price")}
          />
        )}

        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-50"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-amber-700">
        Active filters:
      </span>

      {filterState.search && (
        <FilterBadge
          label="Search"
          value={filterState.search}
          onRemove={() => removeFilter("search")}
        />
      )}

      {filterState.sort && (
        <FilterBadge
          label="Sort"
          value={filterState.sort
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
          onRemove={() => removeFilter("sort")}
        />
      )}

      {filterState.rating && (
        <FilterBadge
          label="Rating"
          value={filterState.rating.replace(/_/g, " ").toLowerCase()}
          onRemove={() => removeFilter("rating")}
        />
      )}

      {(filterState.fromPrice !== 0 || filterState.toPrice !== 100) && (
        <FilterBadge
          label="Price"
          value={`$${filterState.fromPrice} - $${filterState.toPrice}`}
          onRemove={() => removeFilter("price")}
        />
      )}

      {filterState.categoriesIds!.length > 0 && getCategoryName && (
        <FilterBadge
          label="Categories"
          value={filterState
            .categoriesIds!.map((c) => getCategoryName(c))
            .join(", ")}
          onRemove={() => removeFilter("category")}
        />
      )}

      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-50 ml-auto"
        onClick={clearAllFilters}
      >
        Clear all
      </Button>
    </div>
  );
}
