'use client'
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { EmployeeRecord } from './page';

const hsaContributionLimit = {
  self: 3850,
  family: 7750,
}

const hdhpMinimumDeductible = {
  self: 1500,
  family: 3000,
}

const hsaCatchUpContributationAmount = 1000;

export default function HSATable({ records }: { records: EmployeeRecord[] }) {
  const hsaTableData = records.map(record => {
    const {
      Name: name,
      Deductible: deductible,
    } = record.fields
    const planType = record.fields["Plan type"]
    const dob = record.fields["Date of birth"]

    // const isHsaEligible = 

    return {
      name,
      deductible,
      planType,
      dob,
    }
  });


  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(records.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return records.slice(start, end);
  }, [page, records]);


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
        <TableColumn>Name</TableColumn>
        <TableColumn>DOB</TableColumn>
        <TableColumn>Plan Type</TableColumn>
        <TableColumn>Deductible</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow>
            <TableCell>{item.fields.Name}</TableCell>
            <TableCell>{item.fields["Date of birth"]}</TableCell>
            <TableCell>{item.fields["Plan type"]}</TableCell>
            <TableCell>{`${item.fields.Deductible}`}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>)
}