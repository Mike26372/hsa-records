import HSATable from "./hsa-table";

type Records = {
	records: EmployeeRecord[]
}

export type EmployeeRecord = {
	id: String;
	createdTime: String;
	fields: EmployeeFields
}

type EmployeeFields = {
	'Plan type': String;
	Name: String;
	Deductible: Number;
	'Date of birth': String;
}

async function getEmployeeRecords(): Promise<Records | undefined> {
	const res = await fetch('https://api.airtable.com/v0/appekA493GuXz8uDK/tbllLFdZDMfLjAT4N', {
		headers: {
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
