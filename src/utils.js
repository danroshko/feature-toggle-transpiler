/**
 * Extract feature name from comment
 * '#[feature(foo)]' -> 'foo'
 * @param {string} comment
 */
const extractFeatureName = comment => {
  const offset = 10 // leangth of '#[feature('

  const start = comment.indexOf('#[feature(')
  if (start === -1) return null

  const end = comment.indexOf(')]', start + offset)
  if (end === -1) return null

  return comment.slice(start + offset, end)
}

/**
 * Scan through source file to check if it contains some disabled features
 */
const detectDisabledFeatures = (source, featureToggle) => {
  const re = /#\[feature\([\w\-\_\:]+\)\]/gi

  const matches = source.match(re)
  if (!matches) return false

  for (const match of matches) {
    const feature = extractFeatureName(match)

    if (featureToggle.isDisabled(feature)) {
      return true
    }
  }

  return false
}

exports.extractFeatureName = extractFeatureName
exports.detectDisabledFeatures = detectDisabledFeatures
