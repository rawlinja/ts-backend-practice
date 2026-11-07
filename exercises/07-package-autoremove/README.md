# Exercise 07: Package Autoremove

## Scenario

A package manager tracks which packages the user asked for directly and which
were dragged in only to satisfy something else's dependencies. When the user
uninstalls a package, the auto-installed ones it was propping up should go too —
unless something still installed needs them. This is what `apt autoremove` does.

## Requirement 1

Implement `autoremove(packages, removeNames)` in `solution.ts`.

Every package in `packages` starts out installed. First remove each name in
`removeNames`. Then reclaim, repeatedly, any package that is **not**
`manuallyInstalled` and that no remaining installed package lists in its
`dependsOn` — removing one can orphan another, so keep going until nothing
changes.

A manually installed package is only ever removed by being named in
`removeNames`. It is never reclaimed.

Return both lists sorted ascending. Every input package appears in exactly one
of them.

### Expected behavior (from fixtures)

Removing `web-app`:

- `http-lib` was needed only by `web-app` → reclaimed.
- `socket-lib` was needed only by `http-lib` → reclaimed in turn.
- `json-lib` stays: `cli-tool` still needs it.
- `cli-tool` stays: manually installed.
- `plugin-a` and `plugin-b` stay: each is still listed by the other.

```text
removed:  ['http-lib', 'socket-lib', 'web-app']
retained: ['cli-tool', 'json-lib', 'plugin-a', 'plugin-b']
```

## Constraints

- TypeScript and in-memory data structures only.
- No database, web framework, timers, or external services.
- `removeNames` contains only manually installed package names, or names that
  are not installed at all. Names that are not installed are ignored.
- A name in `dependsOn` may refer to a package that is not installed.
- Input may be empty.
- Do not mutate the input `packages`.

## Files

- Edit: `exercises/07-package-autoremove/solution.ts`
- Types: `exercises/07-package-autoremove/types.ts`
- Fixtures: `exercises/07-package-autoremove/fixtures.ts`

## Test command

```bash
pnpm test exercises/07-package-autoremove/solution.test.ts
```
