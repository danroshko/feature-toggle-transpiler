const fs = require('fs')
const path = require('path')
const transform = require('./transform')

/**
 * Recursively rewrites all source files in *root* directory removing disabled features
 */
const rewriteSync = (root, featureToggle) => {
  const files = fs.readdirSync(root)

  for (const file of files) {
    const filePath = path.join(root, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      rewriteSync(filePath, featureToggle)
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

      const result = transform(content, {
        useTypescriptPlugin: file.endsWith('.ts'),
        featureToggle,
      })

      fs.writeFileSync(filePath, result)
    }
  }
}

exports.rewriteSync = rewriteSync
