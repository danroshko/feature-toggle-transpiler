const { detectDisabledFeatures, extractFeatureNames } = require('../src/utils')

describe('extractFeatureName', () => {
  it('returns empty array if comment does not contain features', () => {
    const comments = ['*** some text', '[]()', '#!/bin/bash', '', '#[unknown]']

    for (const comment of comments) {
      const f = extractFeatureNames(comment)
      expect(f).toEqual([])
    }
  })

  it('finds name in simple comments', () => {
    expect(extractFeatureNames('#[feature(foo)]')).toEqual(['foo'])
    expect(extractFeatureNames(' #[feature(bar)] ')).toEqual(['bar'])
    expect(extractFeatureNames('* #[feature(foo:bar)] some text')).toEqual(['foo:bar'])
  })

  it('finds name in multiline comments', () => {
    const comment1 = `
      #[feature(abc-def)]
      *
      *
    `
    expect(extractFeatureNames(comment1)).toEqual(['abc-def'])

    const comment2 = `
      @apiVersion 1
      #[feature(abc:def)]
      ## * ^ *
    `
    expect(extractFeatureNames(comment2)).toEqual(['abc:def'])
  })

  it('finds all names in comments with multiple features', () => {
    const comment1 = `
      #[feature(ABC)]
      #[feature(DEF)]
    `
    expect(extractFeatureNames(comment1)).toEqual(['ABC', 'DEF'])

    const comment2 = `
      #[feature(f1)]
      some description
      #[feature(f2)]
      ### even more text
    `
    expect(extractFeatureNames(comment2)).toEqual(['f1', 'f2'])
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
