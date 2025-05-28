import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItemsSkeletonProps {
  itemCount?: number;
}

export function OrderItemsSkeleton({ itemCount = 3 }: OrderItemsSkeletonProps) {
  return (
    <Card className="md:col-span-2 border-amber-100">
      <CardHeader className="pb-3 border-b border-amber-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {Array(itemCount)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-6 w-28 my-2" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="mt-3">
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </div>
                </div>
                {index < itemCount - 1 && (
                  <Separator className="my-4 bg-amber-100" />
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
