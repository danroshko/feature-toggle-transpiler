const { detectDisabledFeatures, extractFeatureName } = require('../src/utils')

describe('extractFeatureName', () => {
  it('returns null if comment does not contain features', () => {
    const comments = ['*** some text', '[]()', '#!/bin/bash', '', '#[unknown]']

    for (const comment of comments) {
      const f = extractFeatureName(comment)
      expect(f).toBe(null)
    }
  })

  it('finds name in simple comments', () => {
    expect(extractFeatureName('#[feature(foo)]')).toBe('foo')
    expect(extractFeatureName(' #[feature(bar)] ')).toBe('bar')
    expect(extractFeatureName('* #[feature(foo:bar)] some text')).toBe('foo:bar')
  })

  it('finds name in multiline comments', () => {
    expect(
      extractFeatureName(`
      #[feature(abc-def)]
      *
      *
    `)
    ).toBe('abc-def')

    expect(
      extractFeatureName(`
      @apiVersion 1
      #[feature(abc:def)]
      ## * ^ *
    `)
    ).toBe('abc:def')
  })
})

describe('detectDisabledFeatures', () => {
  const toggleMock = {
    isDisabled: feature => feature.startsWith('foo'),
  }

  it('returns false if source does not contain features', () => {
    const sources = [
      `text`,
      `multiline
      text`,
      `#something
      foo()`,
      `!(feature)
      #[something()]`,
    ]

    for (const source of sources) {
      expect(detectDisabledFeatures(source, toggleMock)).toBe(false)
    }
  })

  it('returns false if source contains only enabled features', () => {
    const sources = [`#[feature(abc)]`, `** #[feature(abc:bar)]`]

    for (const source of sources) {
      expect(detectDisabledFeatures(source, toggleMock)).toBe(false)
    }
  })

  it('returns true if source contains disabled features', () => {
    const sources = [
      `#[feature(foo)]`,
      `
        #[feature(enabled)]
        #[feature(foo)]
      `,
      `
      ! some comment
      * # @ some symbols

      #[feature(foo:bar)]`,
    ]

    for (const source of sources) {
      expect(detectDisabledFeatures(source, toggleMock)).toBe(true)
    }
  })
})
