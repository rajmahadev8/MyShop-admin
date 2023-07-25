"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string
  name: string
  createdTime: string
  billboardLabel: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey:"billboard",
    header:"Billboard",
    cell: ({row})=>row.original.billboardLabel
  },
  {
    accessorKey: "createdTime",
    header: "Date",
  },
  {
    id:"actions",
    cell: ({row})=><CellAction data={row.original}/>
  }
]
