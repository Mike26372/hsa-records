import HSATable from "./hsa-table";

type Records = {
	records: EmployeeRecord[]
}

export type EmployeeRecord = {
	id: string;
	createdTime: string;
	fields: EmployeeFields
}

export const planTypeFamily = "Family"
export const planTypeSelf = "Self-only"

type PlanType = typeof planTypeFamily | typeof planTypeSelf

type EmployeeFields = {
	'Plan type': PlanType;
	Name: string;
	Deductible: number;
	'Date of birth': string;
}

async function getEmployeeRecords(): Promise<Records | undefined> {
	const res = await fetch('https://api.airtable.com/v0/appekA493GuXz8uDK/tbllLFdZDMfLjAT4N', {
		headers: {
			// TOOD: Allow this to be pased as env variable via flags.
			"Authorization": "Bearer patawZWIa4hg1HinJ.260bae64187b68bb9e6de8c081b10a1d2f5b66e750839c84f616e978267ea31d",
		},
	})

	try {
		return res.json()
	} catch (e) {
		console.error(e);
	}
}

export default async function Home() {
	const employeeRecords = await getEmployeeRecords()

	if (!employeeRecords) {
		return null
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<HSATable records={employeeRecords.records} />
		</section>
	);
}
