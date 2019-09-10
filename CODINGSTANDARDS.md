# Coding conventions for crocks

## tl;dr;

* `npm run setup` installs all the things
* `npm run lint` to check for styling issues
* `npm run spec:dev` to have tests running while coding
* `npm run spec:coverage` to ensure coverage is within expected levels
* `npm run test` to run all things that will run on CI

## Coding Standards

This page will act as the basis for the `crocks` coding standards. The more
this document is followed, the less comments you will receive on your PR. If you
find anything that does not match these coding standards, feel free to create a
PR to align the code with them

### Header

Each main file (not `.spec`) file has a header similiar to the below. If you add
a new file, put your own details in as well as the current year. If the file
already has a header there is no need to update it.

```javascript
/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */
```

### Main File Structure

The following is an example of the normal structure of a core library file 
using `find` as an example of this structure. It is also a good example of
how each argument should be validated.

#### Header

As stated above, the header should display the year of authorship along with
the details of the author within the structure of the following license statement

```javascript
/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */
```

#### Imports

The imports should be in two alphabetized groups with data types as the first
group and functions as the second.

```javascript
const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const predOrFunc = require('../core/predOrFunc')
```

#### Local functions

Local or destructured functions from your imports are done between
the imports and the main function.

```javascript
const { Just, Nothing } = require('.')

const accumulator = fn => (acc, cur) =>
  !acc.found && predOrFunc(fn, cur) ? { found: true, value: cur } : acc
```

#### Main function

The main function must have a function signature written above using the
Hindley–Milner type notation. If you need help, just ask on
the [Gitter][gitter] channel. Each argument should be validated to be it's
expected type, throwing a `TypeError` if it is not. Error messages should use a
consistent voice, preferring active over passive voices where possible:

Good:
"First argument must be a Number"

Bad:
"Number is required for first argument"

```javascript
// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn) && !isSameType(Pred, fn)) {
    throw new TypeError('find: First argument must be a Pred or predicate')
  }

  if(!isFoldable(foldable)) {
    throw new TypeError('find: Second argument must be a Foldable')
  }

  const result = foldable.reduce(accumulator(fn), { found: false })

  return result.found ? Just(result.value) : Nothing()
}
```

#### Export

The final piece of the puzzle is exporting the main function. As a standard
all functions exported from `crocks` are [`curried`][curry]

```javascript
module.exports = curry(find)
```

### Specs

The following is an excerpt of the `spec` file for `find`. It shows the
structure as well as the expected level of testing for each function.

#### Imports

Imports are done very similiar to main functions with the minor change
that `tape` is placed on it's own line.

```javascript
const test = require('tape')

const Pred = require('../Pred')
const List = require('../core/List')
const Maybe = require('../core/Maybe')

const constant = require('../combinators/constant')
const find = require('./find')
const isFunction = require('../core/isFunction')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const { bindFunc } = require('../test/helpers')
const { fromArray } = List
```

#### Testing sections

The spec file will contain one or many collections of tests grouped by subject
matter. For example testing input validation for an argument. 
We also generally test with the following set of values to ensure there is
proper protection. Remember, writing tests is about regression and protection
from future changes.


```javascript
test('find is protected from bad fn', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /^TypeError: find: First argument must be a Pred or predicate/

  t.throws(fn(undefined), err, 'throws if fn is undefined')
  t.throws(fn(null), err, 'throws if fn is null')
  t.throws(fn(0), err, 'throws if fn is falsey number')
  t.throws(fn(1), err, 'throws if fn is truthy number')
  t.throws(fn(NaN), err, 'throws if fn is NaN')
  t.throws(fn(''), err, 'throws if fn is falsey string')
  t.throws(fn('string'), err, 'throws if fn is truthy string')
  t.throws(fn(false), err, 'throws if fn is false')
  t.throws(fn(true), err, 'throws if fn is true')
  t.throws(fn({}), err, 'throws if fn is empty POJO')
  t.throws(fn({ hi: 'there' }), err, 'throws if fn is non-empty POJO')

  t.end()
})
```

## Documentation Standards

If you become familiar with the documentation, its structure and format will
become easy to replicate. The docs consist of two main document structures and
within them a particular coding started for the sample code. For function list
pages it is a simple structure of title, signature, description and example. The
container types documentation is just a larger version of this standard.

### Description

A description should contain the direct import path to the function followed by
the functions signature then a details description of the functions purpose and
features using plain language. Any library function references should be linked

> `crocks/combinators/composeB`
> 
> ```haskell
> composeB :: (b -> c) -> (a -> b) -> a -> c
> ```
> 
> Provides a means to describe a composition between two functions. it takes two
> functions and a value. Given `composeB(f, g)`, which is read `f` after `g`, it
> will return a function that will take value `a` and apply it to `g`, passing the
> result as an argument to `f`, and will finally return the result of `f`. This
> allows only two functions, if you want to avoid things like:
> `composeB(composeB(f, g), composeB(h, i))` then check
> out [`compose`][compose].

### Imports

The `imports` have three sections the first is a single line that is the subject
of the example, the second is an alphabetic list of and container types that
are required and the third is an alphabetic list of all the functions required.
We also out of habit will show some basic usage first, then launch into a more
real world scenario.

```javascript
import composeB from 'crocks/combinators/composeB'

import Either from 'crocks/Either'

import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
```

### Examples

When writing documentation examples start out with very simple usages to show
how the functions works, followed by a more real-world scenario. Each function
should also have a proper signature above it. When you invoke the function, it
should also have the result of that invocation commented below. 

```javascript
// yell :: String -> String
const yell = x =>
  `${x.toUpperCase()}!`

// safeYell :: a -> Either a String
const safeYell =  ifElse(
  isString,
  composeB(Right, yell),
  Left
)

safeYell('quite')
//=> Right "QUITE!"

safeYell(42)
//=> Left 42
```

[gitter]: https://gitter.im/crocksjs/crocks
[compose]: ./helpers.html#compose
[curry]: ./helpers.html#curry
