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

const planTypeFamily = "Family"
const planTypeSelf = "Self-only"

const hsaContributionLimitByPlanType = {
  [planTypeSelf]: 3850,
  [planTypeFamily]: 7750,
}

const hdhpMinimumDeductibleByPlanType: { [planTypeFamily]: number, [planTypeSelf]: number } = {
  [planTypeSelf]: 1500,
  [planTypeFamily]: 3000,
}

const hsaCatchUpContributationAmount = 1000;

function isAge55OrGreaterWithinCurrentYear(dob: string): boolean {
  // Create a date object with the target's birthday.
  const birthDateObject = new Date(dob);

  // Get the current date for comparison.
  const currentDate = new Date();

  // Calculate the age.
  const age = currentDate.getFullYear() - birthDateObject.getFullYear();

  // Check if the person is already 55 years of age or older, or will turn 55 during the current year.
  return age >= 55 || (currentDate.getMonth() >= birthDateObject.getMonth())
}

export default function HSATable({ records }: { records: EmployeeRecord[] }) {
  const hsaTableData = records.map(record => {
    const { id } = record;
    const {
      Name: name,
      Deductible: deductible,
    } = record.fields
    const planType = record.fields["Plan type"]
    const dob = record.fields["Date of birth"]

    const isHsaEligible = deductible > hdhpMinimumDeductibleByPlanType[planType]
    const hsaContributionLimit = hsaContributionLimitByPlanType[planType]

    const hsaMaxContribution = isAge55OrGreaterWithinCurrentYear(dob) ? hsaCatchUpContributationAmount + hsaContributionLimit : hsaCatchUpContributationAmount

    return {
      id,
      name,
      deductible,
      planType,
      dob,
      isHsaEligible,
      hsaMaxContribution,
    }
  });


  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(records.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return hsaTableData.slice(start, end);
  }, [page, hsaTableData]);


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
        <TableColumn>HSA Eligible</TableColumn>
        <TableColumn>HSA Max Contribution</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.dob}</TableCell>
            <TableCell>{item.planType}</TableCell>
            <TableCell>{`${item.deductible}`}</TableCell>
            <TableCell>{item.isHsaEligible ? "Yes" : "No"}</TableCell>
            <TableCell>{item.isHsaEligible ? item.hsaMaxContribution : "NA"}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>)
}