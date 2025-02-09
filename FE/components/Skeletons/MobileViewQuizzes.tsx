import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";

export const MobileSkeletonCard = () => (
  <Card className="mb-4">
    <CardContent className="pt-4">
      <div className="space-y-3">
        {/* Title Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        {/* Description Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        {/* Duration Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        {/* Deadline Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        {/* Questions Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
        {/* Buttons Skeleton */}
        <div className="flex items-center justify-center flex-col gap-2">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    </CardContent>
  </Card>
);