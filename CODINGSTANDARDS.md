# Coding conventions for crocks

## tl;dr;

* `npm run lint` to check for styling issues
* `npm run spec:dev` to have tests running while coding
* `npm run spec:coverage` to ensure coverage is within expected levels

## Coding Standards

This page will act as the basis for the `crocks` coding standards. The more
this document is followed, the less comments you will recieve on your PR. If you
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

### Structure

#### Main
The main files will follow a basic structure. 

```javascript
// Header

// alphabetized imports

// private helper functions

// main function code

// single line curried function assigned to module.exports 
```

`mreduceMap` is a nice example of this structure. It also shows how each argument
should be validated.

```javascript
/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isMonoid = require('../core/isMonoid')
const mconcatMap = require('../core/mconcatMap')

// mreduceMap :: Monoid M => M -> (b -> a) -> ( [ b ] | List b ) -> a
function mreduceMap(m, f, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mreduceMap: Monoid required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'mreduceMap: Function required for second argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mreduceMap: Foldable required for third argument'
    )
  }

  return mconcatMap(m, f, xs).valueOf()
}

module.exports = curry(mreduceMap)
```

#### Spec

```javascript
// single line tape import

// import of method to test

// import of other required methods

// All the tests
```

The following is the `spec` file for `mreduceMap`. It shows the structure as
well as the expected level of testing for each function

```javascript
const test = require('tape')
const Last = require('../test/LastMonoid')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const mreduceMap = require('./mreduceMap')

test('mreduceMap helper', t => {
  const mc = bindFunc(mreduceMap)

  t.ok(isFunction(mreduceMap), 'is a function')

  const first = /mreduceMap: Monoid required for first argument/
  t.throws(mc(undefined, unit, []), first, 'throws when first arg is undefined')
  t.throws(mc(null, unit, []), first, 'throws when first arg is null')
  t.throws(mc(0, unit, []), first, 'throws when first arg is falsey number')
  t.throws(mc(1, unit, []), first, 'throws when first arg is truthy number')
  t.throws(mc('', unit, []), first, 'throws when first arg is falsey string')
  t.throws(mc('string', unit, []), first, 'throws when first arg is truthy string')
  t.throws(mc(false, unit, []), first, 'throws when first arg is false')
  t.throws(mc(true, unit, []), first, 'throws when first arg is true')
  t.throws(mc({}, unit, []), first, 'throws when first arg is an object')
  t.throws(mc([], unit, []), first, 'throws when first arg is an array')

  const second = /mreduceMap: Function required for second argument/
  t.throws(mc(Last, undefined, []), second, 'throws when second arg is undefined')
  t.throws(mc(Last, null, []), second, 'throws when second arg is null')
  t.throws(mc(Last, 0, []), second, 'throws when second arg is falsey number')
  t.throws(mc(Last, 1, []), second, 'throws when second arg is truthy number')
  t.throws(mc(Last, '', []), second, 'throws when second arg is falsey string')
  t.throws(mc(Last, 'string', []), second, 'throws when second arg is truthy string')
  t.throws(mc(Last, false, []), second, 'throws when second arg is false')
  t.throws(mc(Last, true, []), second, 'throws when second arg is true')
  t.throws(mc(Last, {}, []), second, 'throws when second arg is an object')
  t.throws(mc(Last, [], []), second, 'throws when second arg is an array')

  const last = /mreduceMap: Foldable required for third argument/
  t.throws(mc(Last, unit, undefined), last, 'throws when third arg is undefined')
  t.throws(mc(Last, unit, null), last, 'throws when third arg is null')
  t.throws(mc(Last, unit, 0), last, 'throws when arg third is falsey number')
  t.throws(mc(Last, unit, 1), last, 'throws when arg third is truthy number')
  t.throws(mc(Last, unit, ''), last, 'throws when arg third is falsey string')
  t.throws(mc(Last, unit, 'string'), last, 'throws when third arg is truthy string')
  t.throws(mc(Last, unit, false), last, 'throws when third arg is false')
  t.throws(mc(Last, unit, true), last, 'throws when third arg is true')
  t.throws(mc(Last, unit, {}), last, 'throws when third arg is an object')

  t.doesNotThrow(mc(Last, unit, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const addOne = x => x + 1
  const nothing = mreduceMap(Last, addOne, [])
  const something = mreduceMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing, Last.empty().valueOf(), 'returns the empty value when passed an empty array')
  t.equal(something, 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
```

## Documentation Standards

If you become familiar with the documentation, it's structure and format will
be easy to replicate. The docs consist of two main document structures and
within them a particular coding started for the sample code. For function list
pages it is a simple structure of title, signature, description and example. The
container types documentation is just a larger version of this standard.

The following is an example of a function outline. The `imports` have three
sections the first is a single line that is the subject of the example, the
second is an alphabetic list of and container types that are required and the
third is an alphabetic list of all the functions required. We also out of habit
will show some basic usage first, then launch into a more real world scenario.

#### composeB

`crocks/combinators/composeB`

```haskell
composeB :: (b -> c) -> (a -> b) -> a -> c
```

Provides a means to describe a composition between two functions. it takes two
functions and a value. Given `composeB(f, g)`, which is read `f` after `g`, it
will return a function that will take value `a` and apply it to `g`, passing the
result as an argument to `f`, and will finally return the result of `f`. This
allows only two functions, if you want to avoid things like:
`composeB(composeB(f, g), composeB(h, i))` then check
out [`compose`][compose].

```javascript
import composeB from 'crocks/combinators/composeB'

import Either from 'crocks/Either'

import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'

const { Left, Right } = Either

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

