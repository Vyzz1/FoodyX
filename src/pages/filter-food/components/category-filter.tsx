import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import CategoryLoading from "./category-loading";

interface CategoryFilterProps {
  categories: Category[] | null;
  selectedCategoryIds: string[];
  onCategoryClick: (categoryId: string) => void;
  isLoading: boolean;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategoryIds,
  onCategoryClick,
  isLoading,
  className,
}: CategoryFilterProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2 text-amber-700">Categories</h3>
      {isLoading ? (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <CategoryLoading key={index} />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {categories?.map((c: Category) => (
            <Badge
              key={c.id}
              className={clsx(
                "cursor-pointer border-amber-300 transition-all ease-in",
                selectedCategoryIds?.includes(c.id)
                  ? "bg-amber-400 hover:bg-amber-500 border-amber-500 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:border-amber-600 dark:text-white"
                  : "bg-amber-50 hover:bg-amber-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 text-amber-700 dark:text-white"
              )}
              variant="outline"
              onClick={() => onCategoryClick(c.id)}
            >
              {c.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
