import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const DesktopSkeletonTable = () => (
  <div className="hidden md:block overflow-hidden rounded-lg shadow-sm">
    <div className="overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">
              <Skeleton className="h-4 w-3/4 rounded" />
            </TableHead>
            <TableHead className="w-[20%]">
              <Skeleton className="h-4 w-1/2 rounded" />
            </TableHead>
            <TableHead className="w-[20%]">
              <Skeleton className="h-4 w-1/2 rounded" />
            </TableHead>
            <TableHead className="w-[10%]">
              <Skeleton className="h-4 w-1/4 rounded" />
            </TableHead>
            <TableHead className="w-[20%]">
              <Skeleton className="h-4 w-1/2 rounded" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-3/4 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/2 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/2 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/4 rounded" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);