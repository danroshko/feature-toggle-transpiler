const parser = require('@babel/parser')
const traverse = require('@babel/traverse')
const generate = require('@babel/generator')
const { detectDisabledFeatures, extractFeatureNames } = require('./utils')

const transform = (source, options) => {
  // if source does not contain disabled features, we do not need to modify
  // source and can skip all the following steps
  const shouldParse = detectDisabledFeatures(source, options.featureToggle)

  if (!shouldParse) return source

  const { featureToggle } = options

  // parse source code into AST
  const ast = parser.parse(source, {
    sourceType: 'unambiguous',
    plugins: options.useTypescriptPlugin ? ['typescript'] : [],
  })

  // traverse AST and remove nodes that contains leading comments with disabled features
  traverse.default(ast, {
    enter(path) {
      const comments = path.node.leadingComments

      if (comments != null && comments.length > 0) {
        const comment = comments[comments.length - 1]
        const features = extractFeatureNames(comment.value)

        const shouldRemove = features.length > 0 && features.some(feature => featureToggle.isDisabled(feature))

        if (shouldRemove) path.remove()
      }
    },
  })

  // transform resulting AST back into string representation
  const result = generate.default(
    ast,
    {
      retainLines: true,
      shouldPrintComment(comment) {
        const features = extractFeatureNames(comment)
        return !features.length || features.every(feature => featureToggle.isEnabled(feature))
      },
    },
    source
  )

  return result.code
}

module.exports = transform
