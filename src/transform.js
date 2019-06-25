const parser = require('@babel/parser')
const traverse = require('@babel/traverse')
const generate = require('@babel/generator')
const { detectDisabledFeatures, extractFeatureName } = require('./utils')

const transform = (source, options) => {
  // if source does not contain disabled features, we do not need to modify
  // source and can skip all the following steps
  const shouldParse = detectDisabledFeatures(source, options.featureToggle)

  if (!shouldParse) return source

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
        const feature = extractFeatureName(comment.value)

        if (feature && options.featureToggle.isDisabled(feature)) {
          path.remove()
        }
      }
    },
  })

  // transform resulting AST back into string representation
  const result = generate.default(
    ast,
    {
      retainLines: true,
      shouldPrintComment(comment) {
        const feature = extractFeatureName(comment)
        return !feature || options.featureToggle.isEnabled(feature)
      },
    },
    source
  )

  return result.code
}

module.exports = transform
