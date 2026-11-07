import { describe, expect, it } from "vitest";

import { labResults, patients } from "./fixtures.js";
import { buildLabResultAlerts } from "./solution.js";
import type { LabResult } from "./types.js";

describe("buildLabResultAlerts", () => {
  it("returns alerts for finalized results outside their reference ranges", () => {
    expect(buildLabResultAlerts(labResults, patients)).toEqual([
      {
        resultId: "lab_9005",
        patientId: "pat_1003",
        patientName: "Elena Rivera",
        dateOfBirth: "1991-07-29",
        providerId: "prov_internal_42",
        testCode: "TSH",
        testName: "Thyroid Stimulating Hormone",
        direction: "low",
        value: 0.18,
        unit: "mIU/L",
        normalRange: "0.4-4 mIU/L",
        collectedAt: "2026-07-12T10:45:00.000Z",
      },
      {
        resultId: "lab_9002",
        patientId: "pat_1002",
        patientName: "Andre Walker",
        dateOfBirth: "1976-11-02",
        providerId: "prov_internal_17",
        testCode: "HGB",
        testName: "Hemoglobin",
        direction: "low",
        value: 10.8,
        unit: "g/dL",
        normalRange: "13.5-17.5 g/dL",
        collectedAt: "2026-07-11T09:15:00.000Z",
      },
      {
        resultId: "lab_9001",
        patientId: "pat_1001",
        patientName: "Maya Chen",
        dateOfBirth: "1984-03-12",
        providerId: "prov_internal_42",
        testCode: "K",
        testName: "Potassium",
        direction: "high",
        value: 5.9,
        unit: "mmol/L",
        normalRange: "3.5-5.1 mmol/L",
        collectedAt: "2026-07-10T14:30:00.000Z",
      },
    ]);
  });

  it("ignores results that cannot be evaluated or cannot be assigned to a known patient", () => {
    const incompleteResults: LabResult[] = [
      {
        id: "lab_missing_value",
        patientId: "pat_1001",
        testCode: "WBC",
        testName: "White Blood Cell Count",
        collectedAt: "2026-07-13T08:00:00.000Z",
        resultedAt: "2026-07-13T09:00:00.000Z",
        status: "final",
        value: null,
        unit: "10*3/uL",
        referenceRange: { low: 4.5, high: 11 },
      },
      {
        id: "lab_missing_range",
        patientId: "pat_1001",
        testCode: "CRP",
        testName: "C-Reactive Protein",
        collectedAt: "2026-07-13T08:10:00.000Z",
        resultedAt: "2026-07-13T09:10:00.000Z",
        status: "final",
        value: 18,
        unit: "mg/L",
        referenceRange: { low: null, high: null },
      },
      {
        id: "lab_unknown_patient",
        patientId: "pat_missing",
        testCode: "ALT",
        testName: "Alanine Aminotransferase",
        collectedAt: "2026-07-13T08:20:00.000Z",
        resultedAt: "2026-07-13T09:20:00.000Z",
        status: "final",
        value: 82,
        unit: "U/L",
        referenceRange: { low: 7, high: 56 },
      },
      {
        id: "lab_normal",
        patientId: "pat_1002",
        testCode: "PLT",
        testName: "Platelet Count",
        collectedAt: "2026-07-13T08:30:00.000Z",
        resultedAt: "2026-07-13T09:30:00.000Z",
        status: "final",
        value: 250,
        unit: "10*3/uL",
        referenceRange: { low: 150, high: 400 },
      },
    ];

    expect(buildLabResultAlerts(incompleteResults, patients)).toEqual([]);
  });

  it("sorts alerts by collection time descending, then patient id ascending", () => {
    const sameTimeResults: LabResult[] = [
      {
        id: "lab_same_time_b",
        patientId: "pat_1002",
        testCode: "CREAT",
        testName: "Creatinine",
        collectedAt: "2026-07-14T12:00:00.000Z",
        resultedAt: "2026-07-14T13:00:00.000Z",
        status: "final",
        value: 1.6,
        unit: "mg/dL",
        referenceRange: { low: 0.7, high: 1.3 },
      },
      {
        id: "lab_same_time_a",
        patientId: "pat_1001",
        testCode: "CREAT",
        testName: "Creatinine",
        collectedAt: "2026-07-14T12:00:00.000Z",
        resultedAt: "2026-07-14T13:02:00.000Z",
        status: "final",
        value: 1.5,
        unit: "mg/dL",
        referenceRange: { low: 0.7, high: 1.3 },
      },
    ];

    expect(buildLabResultAlerts(sameTimeResults, patients).map((alert) => alert.resultId)).toEqual([
      "lab_same_time_a",
      "lab_same_time_b",
    ]);
  });
});
