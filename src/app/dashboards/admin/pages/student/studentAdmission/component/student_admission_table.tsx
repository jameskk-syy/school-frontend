"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"

export type StudentAdmission = {
  title: string
  academic_year: string
  admission_end_date: string
  admission_start_date: string
  introduction: string
  enable_admission_application: string
}
interface StudentAdmissionTableProps {
  data: StudentAdmission[]
  purpose: string
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function StudentAdmissionTable({ data, onEdit, onDelete, purpose }: StudentAdmissionTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 5

  console.log("StudentAdmissionTable data:", data)

  const columns: ColumnDef<StudentAdmission>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    { accessorKey: "academic_year", header: "Academic Year" },
    { accessorKey: "admission_end_date", header: "Admission End Date" },
     { accessorKey: "admission_start_date", header: "Admission Start Date" },
      { accessorKey: "introduction", header: "Intrduction" },
      { accessorKey: "enable_admission_application", header: "Enabled" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const index = row.index
        const isDisabled = purpose === "view"
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(index)}>
              <FiEdit />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(index)} disabled={isDisabled}>
              <FiTrash2 />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  })

  const pageCount = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedRows = table.getRowModel().rows.slice(startIndex, startIndex + pageSize)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) setCurrentPage(page)
  }

  return (
    <div className="w-full overflow-auto border rounded-md mt-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {paginatedRows.length ? (
            paginatedRows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No student admission data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination className="mt-2 mb-2">
        <PaginationContent>
          <PaginationItem>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
          </PaginationItem>

          {[...Array(pageCount)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "bg-primary text-white" : ""}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {pageCount > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
