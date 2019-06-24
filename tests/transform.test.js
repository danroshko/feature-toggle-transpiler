const { transform } = require('../index')
const { source1, source2 } = require('./sources')

const removeLines = (text, start, count) => {
  const lines = text.split('\n')
  lines.splice(start, count)
  return lines.join('\n')
}

test('it returns unmodified source if all features are enabled', () => {
  const toggle = {
    isEnabled: () => true,
    isDisabled: () => false,
  }

  const options = { useTypescriptPlugin: true, featureToggle: toggle }

  expect(transform(source1, options)).toBe(source1)
  expect(transform(source2, options)).toBe(source2)
})

test('transpiling source1', () => {
  const toggle = {
    isEnabled: f => f !== 'foo',
    isDisabled: f => f === 'foo',
  }
  const options = { useTypescriptPlugin: true, featureToggle: toggle }

  const expected1 = `import Router from 'some-router';
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

  expect(transform(source1, options)).toBe(expected1)

  // disable another feature
  toggle.isEnabled = f => f !== 'bar'
  toggle.isDisabled = f => f === 'bar'

  const expected2 = `import Router from 'some-router';
const router = new Router();

const getFoo = () => {};
const getBar = () => {};

/**
                          * #[feature(foo)]
                          * @api {get} /v1/foo Get foo
                          */
router.get('/foo', getFoo);








export default router;`

  expect(transform(source1, options)).toBe(expected2)
})

test('transpiling source2', () => {
  const toggle = {
    isEnabled: f => f !== 'abc',
    isDisabled: f => f === 'abc',
  }
  const options = { useTypescriptPlugin: true, featureToggle: toggle }

  const expected1 = `// some function
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

  expect(transform(source2, options)).toBe(expected1)

  // disable 'efg' feature
  toggle.isEnabled = f => f !== 'efg'
  toggle.isDisabled = f => f === 'efg'

  const expected2 = `// some function
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

  expect(transform(source2, options)).toBe(expected2)
})
