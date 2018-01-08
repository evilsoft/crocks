---
title: "Getting Started"
description: "Getting started with a Crocks."
icon: "arrow-right-rod"
layout: "guide"
weight: 1
---

<article id="installation">

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need
to do is run the following to save it as a dependency in your current project
folder:

```
$ npm install crocks -S
```

This will pull down `crocks` into your project's `node_modules` folder and can
be accessed by adding something like the following in the file that needs it:

```javascript
// node require syntax
const crocks = require('crocks')

// Javascript modules (if you are transpiling)
import crocks from 'crocks'
```

</article>

<article id="import-only-what-you-need">

## Import only what's needed

There is a lot to this library, and as such it may not be desired to bring in
the whole thing when bundling for a library or frontend application. If
this is the case, the code is organized in a manner that groups all functions
that return or construct a given ADT into their respective folders. While
general purpose functions are spread across the following
folders: `combinators`, `helpers`, `logic`, `pointfree` and `predicates`.

To access the types, just reference the folder like: `crocks/Maybe`, or
`crocks/Result`. If you want to access a function that constructs a given type,
reference it by name, like: `crocks/Maybe/safe` or `crocks/Result/tryCatch`.
This organization helps ensure that you only include what you need.

### Entire library (CommonJS)

```javascript
// namespace entire suite to crocks variable
const crocks = require('crocks')

// pluck anything that does not require name-spacing
const { safe, isNumber } = crocks

// still requires entire object, but removes name-spacing
const { and, liftA2 } = require('crocks')

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = crocks.curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Entire library (JS Modules)

```javascript
// namespace entire suite to crocks variable
import crocks from 'crocks'

// still imports entire object, but removes name-spacing
import { and, liftA2 }  from 'crocks'

// pluck anything that does not require name-spacing
const { safe, isNumber } = crocks

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = crocks.curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Single entities (CommonJS)

```javascript
// require in each entity directly
const and = require('crocks/logic/and')
const curry = require('crocks/helpers/curry')
const isNumber = require('crocks/predicates/isNumber')
const liftA2 = require('crocks/helpers/liftA2')
const safe = require('crocks/Maybe/safe')

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Single entities (JS Modules)

```javascript
// import in each entity directly
import and from 'crocks/logic/and'
import curry from 'crocks/helpers/curry'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import safe from 'crocks/Maybe/safe'

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

</article>
