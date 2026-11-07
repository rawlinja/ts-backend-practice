# Exercise 02: Lab Result Alerts

## Scenario

A clinic receives lab result records from an external lab system. Providers need a compact review queue showing finalized lab results that are outside the normal reference range.

## Requirement 1

Implement `buildLabResultAlerts` in `solution.ts`.

Given lab results and patient records, return one alert for each finalized or corrected lab result whose numeric value is outside its reference range.

Rules:

- Include results with status `"final"` or `"corrected"`.
- Ignore `"pending"` and `"canceled"` results.
- Ignore results with `value: null`.
- Ignore results unless both `referenceRange.low` and `referenceRange.high` are present.
- Ignore results whose patient id does not match a known patient.
- A result is `"low"` when `value` is less than `referenceRange.low`.
- A result is `"high"` when `value` is greater than `referenceRange.high`.
- Do not alert when  the value is inside the range or exactly equal to either boundary.
- Format `patientName` as `"First Last"`.
- Format `normalRange` as `"{low}-{high} {unit}"`.
- Sort alerts by `collectedAt` descending. If two alerts have the same `collectedAt`, sort by `patientId` ascending.

Run the tests with:

```bash
pnpm test exercises/02-lab-result-alerts/solution.test.ts
```
