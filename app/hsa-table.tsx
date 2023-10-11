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
import { EmployeeRecord, planTypeFamily, planTypeSelf } from "./page";

// Map of contributation limits by plan type.
const hsaContributionLimitByPlanType = {
  [planTypeSelf]: 3850,
  [planTypeFamily]: 7750,
};

// Map of HDHP Minimum Deductible by plan type.
const hdhpMinimumDeductibleByPlanType: {
  [planTypeFamily]: number;
  [planTypeSelf]: number;
} = {
  [planTypeSelf]: 1500,
  [planTypeFamily]: 3000,
};

// Catch up contributation cutogg age.
const hsaCatchUpContributationCutoffAge = 55;
// Catch up contribution amount for individuals older than the cutoff age.
const hsaCatchUpContributationAmount = 1000;


// Calculates whether or not a person will be 55 years of age or older at any point within the current calendar year.
function isAge55OrGreaterWithinCurrentYear(dob: string): boolean {
  // Create a date object with the target's birthday.
  const birthDate = new Date(dob);

  // Get the current date for comparison.
  const currentDate = new Date();

  // Create a date object for the end of the calendar year, less the cutoff age.
  // NOTE: JavaScript date objects assume months are zero-indexed (e.g. 0 == January, 11 == December)
  const endOfYearDateFiftyFiveYearsAgo = new Date(currentDate.getFullYear() - hsaCatchUpContributationCutoffAge, 11, 31)

  // If the time the target was born is before the time of the cutoff age (end of current year less the cutoff age)
  // we can assume the target is older than 55 years old by the end of the current calendar year.
  // NOTE: These date objects both assume time is in UTC for comparison. Since they're both using the same time zone this shouldn't be an issue.
  return birthDate.getTime() <= endOfYearDateFiftyFiveYearsAgo.getTime()
}

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

export default function HSATable({ records }: { records: EmployeeRecord[] }) {
  const hsaTableData = records.map((record) => {
    // Collect all required information from the provided record.
    const { id } = record;
    const { Name: name, Deductible: deductible } = record.fields;
    const planType = record.fields["Plan type"];
    const dateOfBirthString = record.fields["Date of birth"];

    // Format the date of birth.
    const dateOfBirth = new Date(dateOfBirthString);
    // Note: Need to recalculate date using the timezone offset to ensure the date is shown in the current timezone of the user.
    const dateOfBirthCurrentTimezone = new Date(
      dateOfBirth.getTime() - dateOfBirth.getTimezoneOffset() * -60000,
    );
    const month = (dateOfBirthCurrentTimezone.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const date = dateOfBirthCurrentTimezone
      .getDate()
      .toString()
      .padStart(2, "0");
    const year = dateOfBirthCurrentTimezone.getFullYear().toString();
    const dobFormatted = `${month}/${date}/${year}`;

    // Calculate if a user is HSA Eligible and their maximum contribution limit.
    const isHsaEligible =
      deductible > hdhpMinimumDeductibleByPlanType[planType];

    const hsaContributionLimit = hsaContributionLimitByPlanType[planType];
    const hsaMaxContribution = isAge55OrGreaterWithinCurrentYear(
      dateOfBirthString,
    )
      ? hsaContributionLimit + hsaCatchUpContributationAmount
      : hsaContributionLimit;

    return {
      id,
      name,
      deductible,
      planType,
      dobFormatted,
      isHsaEligible,
      hsaMaxContribution,
    };
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
