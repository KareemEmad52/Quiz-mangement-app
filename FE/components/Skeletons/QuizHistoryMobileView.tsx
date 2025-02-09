import { Skeleton } from "../ui/skeleton";

export const QuizHistoryMobileSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
);