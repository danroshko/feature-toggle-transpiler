exports.output1_1 = `import Router from 'some-router';
const router = new Router();

const getFoo = () => {};
const getBar = () => {};







/**
                          * #[feature(bar)]
                          * @api {get} /v1/bar Get bar
                          * @apiVersion 1.0.0
                          */
router.get('/bar', getBar);

export default router;`

exports.output1_2 = `import Router from 'some-router';
const router = new Router();

const getFoo = () => {};
const getBar = () => {};

/**
                          * #[feature(foo)]
                          * @api {get} /v1/foo Get foo
                          */
router.get('/foo', getFoo);








export default router;`

exports.output2_1 = `// some function
export function f(a: number, b: number) {
  // local variable
  let result = 0;




  // #[feature(cde)]
  result += b;

  return result;
}

// another function
export function g(s: string): number {
  let i = s.indexOf('x');

  // meaningless loop #[feature(efg)]
  for (let j = 0; j < i; j++) {
    i *= 2;
  }







  return i;
}

// #[feature(pi)]
export const PI = 3.14;`

exports.output2_2 = `// some function
export function f(a: number, b: number) {
  // local variable
  let result = 0;

  // #[feature(abc)]
  result += a;

  // #[feature(cde)]
  result += b;

  return result;
}

// another function
export function g(s: string): number {
  let i = s.indexOf('x');






  // #[feature(abc)]
  if (i > 100) {
    console.log('Overflow!');
    i = 100;
  }

  return i;
}

// #[feature(pi)]
export const PI = 3.14;`

exports.output3 = exports.source3 = `







/**
 * #[feature(b)]
 * #[feature(c)]
 * comment with different features
 */
exports.prod = (a, b) => a * b;`
