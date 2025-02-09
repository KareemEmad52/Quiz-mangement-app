import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export const QuizCardSkeleton = () => (
  <Card className="hover:shadow-md transition-shadow border border-gray-100">
    <CardHeader>
      {/* Title Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        {/* Badge Skeleton */}
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Description Skeleton */}
      <Skeleton className="h-4 w-full rounded mt-2" />
      {/* Topics Skeleton */}
      <div className="flex flex-wrap gap-2 mt-2">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Duration Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        {/* Questions Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        {/* Due Date Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </CardContent>
  </Card>
);