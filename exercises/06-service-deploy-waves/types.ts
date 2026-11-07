/**
 * A deployable service and the services it requires to be live first.
 *
 * A name in `dependsOn` may refer to a service that is not present in the
 * input — that is a broken dependency, not an error to throw on.
 */
export interface ServiceDefinition {
  name: string;
  dependsOn: string[];
}

/**
 * An ordered deployment plan.
 *
 * `waves[0]` can deploy immediately; every service in `waves[n]` depends only
 * on services appearing in earlier waves. Services that can never safely
 * deploy are reported in `blocked` instead of being placed in a wave.
 */
export interface DeploymentPlan {
  waves: string[][];
  blocked: string[];
}
