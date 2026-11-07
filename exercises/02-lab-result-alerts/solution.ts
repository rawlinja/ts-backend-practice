import type { LabResult, LabResultAlert, Patient } from './types.js';

function formatPatientName(firstName: string, lastName: string): string {
	return `${firstName} ${lastName}`;
}

function formatRange(low: number, high: number, unit: string): string {
	return `${low}-${high} ${unit}`;
}

function getNormalizePatients(patients: Patient[]): Record<string, Patient> {
	const patientsById: Record<string, Patient> = {}

	for(const patient of patients) {
		patientsById[patient.id] = patient
	}
	return patientsById
}

export function buildLabResultAlerts(
	results: LabResult[],
	_patients: Patient[],
): LabResultAlert[] {
	const labResultAlerts: LabResultAlert[] = [];

	const patients = getNormalizePatients(_patients);

	for (const result of results) {
		const {
			status,
			value,
			referenceRange,
			id,
			patientId,
			testCode,
			testName,
			unit,
			collectedAt,
		} = result;

		if (
			status === 'pending' ||
			status === 'canceled' ||
			value === null ||
			referenceRange.low === null ||
			referenceRange.high === null
		) {
			continue;
		}

		if(value >= referenceRange.low && value <= referenceRange.high) {
			continue
		}

		const isLow = value < referenceRange.low;

		if (patients[patientId] === undefined) {
			continue;
		}

		const patient = patients[patientId]

		labResultAlerts.push({
			resultId: id,
			patientId,
			patientName: formatPatientName(patient.firstName, patient.lastName),
			dateOfBirth: patient.dateOfBirth,
			providerId: patient.primaryProviderId,
			testCode,
			testName,
			direction: isLow ? 'low' : 'high',
			value,
			unit,
			normalRange: formatRange(referenceRange.low, referenceRange.high, unit),
			collectedAt,
		});
	}

	return [...labResultAlerts].sort(
		(a, b) =>
			Date.parse(b.collectedAt) - Date.parse(a.collectedAt) ||
			a.patientId.localeCompare(b.patientId),
	);
}
