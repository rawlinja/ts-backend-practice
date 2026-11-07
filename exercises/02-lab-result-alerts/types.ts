export type LabResultStatus = "final" | "pending" | "corrected" | "canceled";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  primaryProviderId: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testCode: string;
  testName: string;
  collectedAt: string;
  resultedAt: string | null;
  status: LabResultStatus;
  value: number | null;
  unit: string;
  referenceRange: {
    low: number | null;
    high: number | null;
  };
}

export type AlertDirection = "low" | "high";

export interface LabResultAlert {
  resultId: string;
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  providerId: string;
  testCode: string;
  testName: string;
  direction: AlertDirection;
  value: number;
  unit: string;
  normalRange: string;
  collectedAt: string;
}
