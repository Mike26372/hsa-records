import HSATable from "./hsa-table";

type Records = {
	records: EmployeeRecord[];
};

export type EmployeeRecord = {
	id: string;
	createdTime: string;
	fields: EmployeeFields;
};

export type EmployeeOutput = {
	id: string;
	name: string;
	deductible: number;
	planType: string;
	dobFormatted: string;
	isHsaEligible: boolean;
	hsaMaxContribution: number;
}

export const planTypeFamily = "Family";
export const planTypeSelf = "Self-only";

type PlanType = typeof planTypeFamily | typeof planTypeSelf;

type EmployeeFields = {
	"Plan type": PlanType;
	Name: string;
	Deductible: number;
	"Date of birth": string;
};

const airtableApiURL = "https://api.airtable.com/v0/appekA493GuXz8uDK/tbllLFdZDMfLjAT4N"

async function getEmployeeRecords(): Promise<Records | undefined> {
	const res = await fetch(
		airtableApiURL,
		{
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
			},
		},
	);

	try {
		return res.json();
	} catch (e) {
		console.error(e);
	}
}

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
function isAge55OrGreaterWithinCurrentYear(birthDate: Date): boolean {
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

export default async function Home() {
	const employeeRecords = await getEmployeeRecords();

	if (!employeeRecords) {
		return null;
	}

	const hsaTableData = employeeRecords.records.map((record) => {
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
			dateOfBirth,
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

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<HSATable data={hsaTableData} />
		</section>
	);
}
