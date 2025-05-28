import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DesktopFilterUI } from "./desktop-filters";
import MobileFilters from "./mobile-filters";

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className }: FilterBarProps) {
  const [params, setParams] = useSearchParams();

  const filter: FoodFilter = {
    search: params.get("search") || "",
    sort: params.get("sort") || "",
    rating: params.get("rating") || "",
    fromPrice: Number(params.get("fromPrice") || "0"),
    toPrice: Number(params.get("toPrice") || "100"),
    categoriesIds: params.getAll("categoriesIds") || [],
  };

  const [filterState, setFilterState] = useState<FoodFilter>(filter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(filterState.search, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(params.toString());
    if (debouncedSearch && debouncedSearch.length > 0) {
      newParams.set("search", debouncedSearch);
    } else {
      newParams.delete("search");
    }
    setParams(newParams);
  }, [debouncedSearch, params, setParams]);

  const removeFilter = (type: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (type === "search") {
      newParams.delete("search");
      setFilterState({ ...filterState, search: "" });
    } else if (type === "sort") {
      newParams.delete("sort");
      setFilterState({ ...filterState, sort: "" });
    } else if (type === "rating") {
      newParams.delete("rating");
      setFilterState({ ...filterState, rating: "" });
    } else if (type === "price") {
      newParams.delete("fromPrice");
      newParams.delete("toPrice");
      setFilterState({
        ...filterState,
        fromPrice: 0,
        toPrice: 100,
      });
    } else if (type === "category") {
      newParams.delete("categoriesIds");
      setFilterState({ ...filterState, categoriesIds: [] });
    }

    setParams(newParams);
  };

  const clearAllFilters = () => {
    setParams(new URLSearchParams());
    setFilterState({
      search: "",
      sort: "",
      rating: "",
      fromPrice: 0,
      toPrice: 100,
      categoriesIds: [],
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    const isSelected = filterState.categoriesIds!.includes(categoryId);
    const updatedIds = isSelected
      ? filterState.categoriesIds!.filter((id) => id !== categoryId)
      : [...filterState.categoriesIds!, categoryId];

    const newParams = new URLSearchParams(params.toString());
    newParams.delete("categoriesIds");
    updatedIds.forEach((id) => newParams.append("categoriesIds", id));

    setFilterState({
      ...filterState,
      categoriesIds: updatedIds,
    });

    setParams(newParams);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();

    if (filterState.search) newParams.set("search", filterState.search);
    if (filterState.sort) newParams.set("sort", filterState.sort);
    if (filterState.rating) newParams.set("rating", filterState.rating);
    if (filterState.fromPrice !== 0)
      newParams.set("fromPrice", filterState.fromPrice!.toString());
    if (filterState.toPrice !== 100)
      newParams.set("toPrice", filterState.toPrice!.toString());

    filterState.categoriesIds?.forEach((id) =>
      newParams.append("categoriesIds", id)
    );

    setParams(newParams);
    setIsFilterOpen(false);
  };

  return (
    <div className={cn("mb-6", className)}>
      <DesktopFilterUI
        filterState={filterState}
        setFilterState={setFilterState}
        params={params}
        setParams={setParams}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        handleCategoryClick={handleCategoryClick}
      />

      <MobileFilters
        params={params}
        removeFilter={removeFilter}
        setParams={setParams}
        applyFilters={applyFilters}
        clearAllFilters={clearAllFilters}
        filterState={filterState}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        setFilterState={setFilterState}
      />
    </div>
  );
}
