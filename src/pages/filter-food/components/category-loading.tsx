import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="w-[80px] h-8 border border-gray-200 px-2 py-2 rounded-md flex items-center justify-between ">
      <Skeleton className="h-3 rounded-md w-full" />
    </div>
  );
}
