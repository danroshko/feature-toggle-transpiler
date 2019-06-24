export function transform(source: string, options: TransformOptions): string

export function rewriteSync(root: string, featureToggle: FeatureToggle): void

interface TransformOptions {
  useTypescriptPlugin?: boolean
  featureToggle: FeatureToggle
}

interface FeatureToggle {
  isEnabled: (feature: string) => boolean
  isDisabled: (feature: string) => boolean
}
