Toggle features in JavaScript/TypeScript projects at build time. Uses comments to mark parts of source code as belonging to certain feature, and babel to remove this parts if feature is disabled.

## Install

```bash
npm i -D @danroshko/feature-toggle-transpiler
```

## Usage

Mark arbitrary block of code as belonging to certain feature:

```js
/*
#[feature(foo)]
the line above means that the following export will be removed if feature 'foo' is disabled
*/
export const foo = 1

/*
#[feature(for)]
it also can be used to remove whole blocks of code, *for* loop will be removed if 'for' is disabled
*/
for (let i = 0; i < 10; i++) {
  console.log(i)
}

/**
 * #[feature(foo)]
 * #[feature(bar)]
 * Multiple flags is also allowed, this export will be removed if any of the 'foo' or 'bar' are disabled
 */
export const foobar = 2
```

Can be used manually to transform strings of code

```js
const { transform } = require('@danroshko/feature-toggle-transpiler')
const fs = require('fs')

const content = fs.readFileSync('./some-file.ts')

// object with two methods which will be called to check if feature is enabled or not
const featureToggle = {
  isEnabled: f => f === 'foo',
  isDisabled: f => f !== 'foo',
}

const result = transform(content, {
  useTypescriptPlugin: true,
  featureToggle,
})
```

Also there is a helper method to rewrite all files in a directory

```js
const { rewriteSync } = require('@danroshko/feature-toggle-transpiler')

rewriteSync('./some/dir/', featureToggle)
```
