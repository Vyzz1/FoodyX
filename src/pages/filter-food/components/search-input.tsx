// search-input.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
      <Input
        placeholder="Search dishes..."
        className="pl-10 border-amber-200 focus-visible:ring-amber-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
