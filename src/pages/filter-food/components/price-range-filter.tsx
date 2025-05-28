import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function PriceRangeFilter({
  fromPrice,
  toPrice,
  onValueChange,
  onValueCommit,
  className,
  isPopover = true,
}: PriceRangeFilterProps) {
  const sliderContent = (
    <div className="flex flex-col gap-4 p-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Price Range</span>
        <span className="text-sm text-amber-600 font-medium">
          ${fromPrice} - ${toPrice}
        </span>
      </div>
      <Slider
        value={[fromPrice, toPrice]}
        min={0}
        max={100}
        step={5}
        className="py-4"
        onValueChange={(value) => {
          onValueChange(value[0], value[1]);
        }}
        onValueCommit={
          onValueCommit
            ? (value) => onValueCommit(value[0], value[1])
            : undefined
        }
      />
    </div>
  );

  if (!isPopover) {
    return <div className={className}>{sliderContent}</div>;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn(
            `border-amber-200 hover:border-amber-300 hover:bg-amber-50`,
            className
          )}
        >
          <DollarSign className="mr-2 h-4 w-4 text-amber-500" />
          {fromPrice !== 0 || toPrice !== 100
            ? `$${fromPrice} - $${toPrice}`
            : "Price Range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">{sliderContent}</PopoverContent>
    </Popover>
  );
}
