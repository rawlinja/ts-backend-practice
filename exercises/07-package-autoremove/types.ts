/**
 * A package that is currently installed on the system.
 *
 * `manuallyInstalled` marks a package the user asked for directly. Everything
 * else was pulled in only to satisfy some other package's `dependsOn`, and has
 * no reason to stay once nothing needs it.
 *
 * A name in `dependsOn` may refer to a package that is not installed.
 */
export interface InstalledPackage {
  name: string;
  dependsOn: string[];
  manuallyInstalled: boolean;
}

/**
 * The outcome of an uninstall, partitioning the original package list.
 *
 * `removed` covers both the explicitly requested packages and everything
 * reclaimed as a knock-on effect. Every input package appears in exactly one
 * of the two lists.
 */
export interface RemovalPlan {
  removed: string[];
  retained: string[];
}
