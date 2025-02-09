"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdateQuizFormSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Quiz Details Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" /> {/* Quiz Details Title */}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quiz Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Quiz Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-20 w-full" /> {/* Textarea */}
          </div>

          {/* Quiz Duration Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Due Date Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full md:w-[240px]" /> {/* Date Picker */}
          </div>
        </CardContent>
      </Card>

      {/* Questions Skeleton */}
      {[1, 2, 3].map((_, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" /> {/* Question Title */}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Text Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Answer Options Skeleton */}
            {[1, 2, 3, 4].map((_, answerIndex) => (
              <div key={answerIndex} className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label */}
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-full" /> {/* Input */}
                  <Skeleton className="h-10 w-24" /> {/* Mark as Correct Button */}
                </div>
              </div>
            ))}
          </CardContent>
          <CardContent>
            {/* Remove Question Button Skeleton */}
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </Card>
      ))}

      {/* Add Question and Generate Quiz Buttons Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-36" /> {/* Add Question Button */}
        <Skeleton className="h-10 w-36" /> {/* Generate Quiz Button */}
      </div>
    </div>
  );
}