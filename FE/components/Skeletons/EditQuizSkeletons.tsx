import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const MobileCardEditQuizSkeleton = () => (
  <Card className="mb-4">
    <CardContent className="pt-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
        <div className="flex items-center justify-center flex-col">
          <Skeleton className="h-10 w-full mt-2" />
          <Skeleton className="h-10 w-full mt-2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DesktopTableEditQuizSkeleton = () => (
  <div className="hidden md:block overflow-hidden rounded-lg shadow-sm">
    <div className="overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-4 w-[100px]" /></TableHead>
            <TableHead><Skeleton className="h-4 w-[100px]" /></TableHead>
            <TableHead><Skeleton className="h-4 w-[100px]" /></TableHead>
            <TableHead><Skeleton className="h-4 w-[100px]" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);