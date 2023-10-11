"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { EmployeeOutput } from "./page";

// Create a formatter to format the dollar amounts.
let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumSignificantDigits: 1,
});

const columnHeaders = [
  "Name",
  "DOB",
  "Plan Type",
  "Deductible",
  "HSA Eligible",
  "HSA Max Contribution",
];

const rowsPerPage = 10;

export default function HSATable({ data }: { data: EmployeeOutput[] }) {
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  return (
    <Table
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        {columnHeaders.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.dobFormatted}</TableCell>
            <TableCell>{item.planType}</TableCell>
            <TableCell>{USDollar.format(item.deductible)}</TableCell>
            <TableCell>{item.isHsaEligible ? "Yes" : "No"}</TableCell>
            <TableCell>
              {item.isHsaEligible
                ? USDollar.format(item.hsaMaxContribution)
                : "NA"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
