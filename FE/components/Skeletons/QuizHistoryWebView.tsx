import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const DesktopSkeletonQuizHistory = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
        <TableHead className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-16 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-24 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-20 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-24 mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);