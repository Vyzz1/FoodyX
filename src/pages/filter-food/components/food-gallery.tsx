import React from "react";
import FoodItem, {
  FoodItemSkeleton,
} from "../../../components/shared/food-item";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FoodGalleryProps {
  foods: MenuItem[];
  className?: string;
  isLoading?: boolean;
}

const FoodGallery: React.FC<FoodGalleryProps> = ({
  foods,
  className,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "grid grid-cols-1 min-[475px]:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 6 }).map((_, index) => (
          <FoodItemSkeleton key={index} />
        ))
      ) : foods.length > 0 ? (
        // Display foods when available
        foods.map((food) => (
          <FoodItem
            key={food.id}
            food={food}
            onViewDetails={() => navigate(`/dish/${food.id}`)}
          />
        ))
      ) : (
        // No foods found message
        <div className="col-span-full text-center py-12">
          <UtensilsCrossed className="h-12 w-12 text-amber-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-amber-800 mb-2">
            No dishes found
          </h3>
          <p className="text-amber-600">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodGallery;
