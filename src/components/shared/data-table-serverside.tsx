import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    totalCount: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    isNext: boolean;
    isLast: boolean;
    isPrevious: boolean;
  };
}
/**
 * Table with server side
 * @param pagination Contains pagination information
 * @param columns Array of column definitions
 * @param data Array of data to be displayed in the table
 * @returns A React component that renders a data table with pagination and filtering
 * @note Suspose that your backend API supports pagination and filtering with limit and page parameters.
 */
export function DataTableServerSide<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { totalPages, limit, currentPage, isLast, isPrevious, isNext } =
    pagination;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      columnFilters,
      sorting,
    },
  });

  useEffect(() => {
    table.setPageSize(limit);
  }, [limit, table]);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="rounded-md border">
        <Table className="overflow-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4 px-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground hidden md:block">
              Rows per page
            </p>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("limit", value);
                newParams.set("page", "0");
                setSearchParams(newParams);
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 8, 10, 15, 20].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:flex items-center  flex flex-wrap grid-cols-2    space-x-2 gap-y-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", "0");
                setSearchParams(newParams);
              }}
              disabled={!isPrevious && currentPage === 0}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", String(currentPage - 1));
                setSearchParams(newParams);
              }}
              disabled={!isPrevious}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", String(currentPage + 1));
                setSearchParams(newParams);
              }}
              disabled={!isNext || isLast}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", String(totalPages - 1));
                setSearchParams(newParams);
              }}
              disabled={isLast}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
