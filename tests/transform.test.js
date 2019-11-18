const { transform } = require('../index')
const { source1, source2, source3 } = require('./examples/inputs')
const outputs = require('./examples/outputs')

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

  expect(transform(source1, options)).toBe(outputs.output1_1)

  // disable another feature
  toggle.isEnabled = f => f !== 'bar'
  toggle.isDisabled = f => f === 'bar'

  expect(transform(source1, options)).toBe(outputs.output1_2)
})

test('transpiling source2', () => {
  const toggle = {
    isEnabled: f => f !== 'abc',
    isDisabled: f => f === 'abc',
  }
  const options = { useTypescriptPlugin: true, featureToggle: toggle }

  expect(transform(source2, options)).toBe(outputs.output2_1)

  // disable 'efg' feature
  toggle.isEnabled = f => f !== 'efg'
  toggle.isDisabled = f => f === 'efg'

  expect(transform(source2, options)).toBe(outputs.output2_2)
})

test('transpiling source3', () => {
  const toggle = {
    isEnabled: f => f !== 'a',
    isDisabled: f => f === 'a',
  }
  const options = { useTypescriptPlugin: false, featureToggle: toggle }

  expect(transform(source3, options)).toBe(outputs.output3)
})
