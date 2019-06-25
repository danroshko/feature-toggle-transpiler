const fs = require('fs')
const { rewriteSync } = require('../index')

let jsBefore = ''
let tsBefore = ''

beforeAll(() => {
  jsBefore = fs.readFileSync('./tests/examples/example.js', { encoding: 'utf-8' })
  tsBefore = fs.readFileSync('./tests/examples/example.ts', { encoding: 'utf-8' })
})

afterEach(() => {
  fs.writeFileSync('./tests/examples/example.js', jsBefore)
  fs.writeFileSync('./tests/examples/example.ts', tsBefore)
})

test('it does not modify files if all features enabled', () => {
  const toggle = {
    isEnabled: () => true,
    isDisabled: () => false,
  }

  rewriteSync('./tests/examples', toggle)

  const jsAfter = fs.readFileSync('./tests/examples/example.js', { encoding: 'utf-8' })
  const tsAfter = fs.readFileSync('./tests/examples/example.ts', { encoding: 'utf-8' })

  expect(jsAfter).toBe(jsBefore)
  expect(tsAfter).toBe(tsBefore)
})

test('it rewrites files if some features are disabled', () => {
  const toggle = {
    isEnabled: f => f !== 'a',
    isDisabled: f => f === 'a',
  }

  rewriteSync('./tests/examples', toggle)

  const jsAfter = fs.readFileSync('./tests/examples/example.js', { encoding: 'utf-8' })
  const tsAfter = fs.readFileSync('./tests/examples/example.ts', { encoding: 'utf-8' })

  expect(jsAfter).toBe(`


// #[feature(b)]
const b = 2;

/* simple comment without feature */
const c = 3;`)

  expect(tsAfter).toBe(`


// #[feature(b)]
export const b = () => 2;`)
})
