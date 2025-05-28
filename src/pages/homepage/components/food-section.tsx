import { cn } from "@/lib/utils";
import FoodItem, { FoodItemSkeleton } from "@/components/shared/food-item";
import { Link, useNavigate } from "react-router-dom";

interface FoodSectionProps {
  title: string;
  className?: string;
  food: MenuItem[];
  isLoading?: boolean;
}

export default function FoodSection({
  title,
  className,
  food,
  isLoading,
}: FoodSectionProps) {
  const navigate = useNavigate();
  return (
    <div className={cn("px-4 py-8", className)}>
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="bg-clip-text font-semibold text-lg md:text-2xl text-transparent bg-gradient-to-b tracking-wide from-amber-800 to-yellow-300">
          {title}
        </h2>

        <Link
          to={"/filter-food"}
          className="text-sm text-slate-800 dark:text-slate-200"
        >
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 grid-cols-1 sm:grid-cols-2 ">
        {isLoading ? (
          Array.from({ length: 6 }, (_, index) => (
            <FoodItemSkeleton key={index} />
          ))
        ) : (
          <>
            {food.map((item) => (
              <FoodItem
                key={item.id}
                food={item}
                onViewDetails={() => {
                  navigate(`dish/${item.id}`);
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
