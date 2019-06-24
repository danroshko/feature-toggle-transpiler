exports.source1 = `import Router from 'some-router';
const router = new Router();

const getFoo = () => {};
const getBar = () => {};

/**
 * #[feature(foo)]
 * @api {get} /v1/foo Get foo
 */
router.get('/foo', getFoo);

/**
 * #[feature(bar)]
 * @api {get} /v1/bar Get bar
 * @apiVersion 1.0.0
 */
router.get('/bar', getBar);

export default router;`

exports.source2 = `// some function
export function f(a: number, b: number) {
  // local variable
  let result = 0

  // #[feature(abc)]
  result += a

  // #[feature(cde)]
  result += b

  return result
}

// another function
export function g(s: string): number {
  let i = s.indexOf('x')

  // meaningless loop #[feature(efg)]
  for (let j = 0; j < i; j++) {
    i *= 2
  }

  // #[feature(abc)]
  if (i > 100) {
    console.log('Overflow!')
    i = 100
  }

  return i
}

// #[feature(pi)]
export const PI = 3.14
`
