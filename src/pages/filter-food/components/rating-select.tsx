import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RatingSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function RatingSelect({
  value,
  onValueChange,
  className,
}: RatingSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(`w-[150px] border-amber-200`, className)}>
        <SelectValue placeholder="Rating" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">All Ratings</SelectItem>
        <SelectItem value="BELOW_3">Under 3 Stars</SelectItem>
        <SelectItem value="BETWEEN_3_AND_4">3 To 4 Stars</SelectItem>
        <SelectItem value="BETWEEN_4_AND_5">4 To 5 Stars</SelectItem>
      </SelectContent>
    </Select>
  );
}
