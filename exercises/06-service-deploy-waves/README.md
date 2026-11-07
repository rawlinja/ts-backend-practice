# Exercise 06: Service Deploy Waves

## Scenario

A release tool deploys a fleet of services that depend on each other. Services
with no unmet dependencies can go out in parallel; everything else has to wait
its turn. Some service definitions are broken — they sit in a dependency cycle,
or point at a service that isn't in the fleet — and those must never be
deployed, along with anything that waits on them.

## Requirement 1

Implement `planDeployment(services)` in `solution.ts`.

Return a `DeploymentPlan` with two parts:

- `waves` — successive batches of service names. The first wave holds services
  with no dependencies. Each later wave holds services whose dependencies all
  appear in **earlier** waves. Names within a wave are sorted ascending.
- `blocked` — every service that can never deploy, sorted ascending. A service
  is blocked if it depends on a name not present in the input, if it takes part
  in a dependency cycle (including depending on itself), or if it depends
  transitively on any blocked service.

Every input service appears exactly once, either in a wave or in `blocked`.

### Expected behavior (from fixtures)

```text
db: []            queue: []
auth: [db]        worker: [db, queue]      api: [auth, db]
billing: [ledger] ledger: [billing]        reporting: [warehouse]
```

```text
waves:   [['db', 'queue'], ['auth', 'worker'], ['api']]
blocked: ['billing', 'ledger', 'reporting']
```

`billing` and `ledger` form a cycle. `reporting` depends on `warehouse`, which
is not in the fleet.

## Constraints

- TypeScript and in-memory data structures only.
- No database, web framework, timers, or external services.
- Input may be empty; `dependsOn` may be empty.
- Do not mutate the input `services`.

## Files

- Edit: `exercises/06-service-deploy-waves/solution.ts`
- Types: `exercises/06-service-deploy-waves/types.ts`
- Fixtures: `exercises/06-service-deploy-waves/fixtures.ts`

## Test command

```bash
pnpm test exercises/06-service-deploy-waves/solution.test.ts
```
