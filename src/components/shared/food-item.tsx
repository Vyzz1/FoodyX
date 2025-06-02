import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

interface FoodItemProps {
  food: MenuItem;
  onViewDetails?: (food: MenuItem) => void;
}

export const FoodItemSkeleton = () => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col ">
      <div className="relative overflow-hidden">
        <Skeleton className="lg:h-56 h-32 md:h-48 w-full overflow-hidden" />
      </div>

      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default function FoodItem({ food, onViewDetails }: FoodItemProps) {
  const queryClient = useQueryClient();
  const handlePrefetchFoodDetails = (foodId: string) => () => {
    if (typeof window === "undefined") return;

    queryClient.prefetchQuery({
      queryKey: ["fetchData", `food/${foodId}`],
      queryFn: async () => {
        const response = await axios.get(`/food/${foodId}`);
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Failed to fetch food details");
        }
      },
    });
  };

  return (
    <motion.div
      layout
      onMouseEnter={handlePrefetchFoodDetails(food.id)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <div className="lg:h-56 h-32 md:h-48 w-full overflow-hidden">
          <img
            src={food.images[0]}
            alt={food.name}
            className="object-cover transition-transform duration-500 group-hover:scale-105 size-full"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-base">
            ${food.sellingPrice.toFixed(2)}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-amber-100 text-amber-800">
            {food.category.name}
          </Badge>
        </div>
      </div>
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-lg sm:line-clamp-2 font-semibold text-amber-900 mb-1 line-clamp-1 dark:text-white">
            {food.name}
          </h3>
          <p className="text-amber-700 text-sm hidden sm:block line-clamp-2 truncate dark:text-neutral-200">
            {food.description}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <Button
            onClick={() => onViewDetails?.(food)}
            size="sm"
            variant="ghost"
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-0 h-auto"
          >
            View details
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-x-0.5">
                  <Clock className="size-4  stroke-orange-500 " />

                  <p className="text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-0 h-auto">
                    {food.timeEstimate} min
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Take approximately {food.timeEstimate} minutes to prepare.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
