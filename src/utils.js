/**
 * Extract feature names from comment
 * '#[feature(foo)]' -> 'foo'
 * @param {string} comment
 */
const extractFeatureNames = comment => {
  const offset = 10 // leangth of '#[feature('

  const features = []
  let start = 0
  let end = 0

  while (true) {
    start = comment.indexOf('#[feature(', end)
    if (start === -1) return features

    end = comment.indexOf(')]', start + offset)
    if (end === -1) return features

    features.push(comment.slice(start + offset, end))
  }
}

/**
 * Scan through source file to check if it contains some disabled features
 */
const detectDisabledFeatures = (source, featureToggle) => {
  const re = /#\[feature\([\w\-\_\:]+\)\]/gi

  const matches = source.match(re)
  if (!matches) return false

  for (const match of matches) {
    const features = extractFeatureNames(match)
    const isDisabled = features.some(feature => featureToggle.isDisabled(feature))

    if (isDisabled) return true
  }

  return false
}

exports.extractFeatureNames = extractFeatureNames
exports.detectDisabledFeatures = detectDisabledFeatures
