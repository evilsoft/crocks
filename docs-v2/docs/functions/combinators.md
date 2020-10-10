---
description: "Combinators API"
layout: "notopic"
title: "Combinators"
functions: ["applyto", "composeb", "constant", "converge", "flip", "identity", "psi", "substitution"]
weight: 10
---

### applyTo

`crocks/combinators/applyTo`

```haskell
applyTo :: a -> (a -> b) -> b
```

Ever run into a situation where you have a value but do not have a function to
apply it to? Well this little bird, named Thrush, is there to help out. Just
give it a value and it will give you back a function ready to take a function.
Once that function is provided, it will return the result of applying your value
to that function.

```js runkit
import applyTo from 'crocks/combinators/applyTo'

import First from 'crocks/First'
import Pair from 'crocks/Pair'

import compose from 'crocks/helpers/compose'
import flip from 'crocks/combinators/flip'
import isArray from 'crocks/predicates/isArray'
import isNumber from 'crocks/predicates/isNumber'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import mreduceMap from 'crocks/helpers/mreduceMap'
import safeLift from 'crocks/Maybe/safeLift'

// prices :: [ Number ]
const prices = [ 4.99, 29.99, 15.99 ]

// getPrices :: (a -> b) -> [ Number ]
const getPrices = compose(
  applyTo(prices),
  map
)

// discount :: Number -> Number -> Number
const discount = percent => price =>
  Number((price - percent / 100 * price).toFixed(2))

getPrices(discount(10))
//=> [ 4.49, 26.99, 14.39 ]

getPrices(discount(80))
//=> [ 1, 6, 3.2 ]

// add :: Number -> Number -> Number
const add = x => y =>
  x + y

// runAll :: [ (a -> b) ] -> a -> [ b ]
const runAll =
  flip(compose(map, applyTo))

runAll([ add(10), add(20) ], 3)
//=> [ 13, 23 ]

// length :: [ a ] -> Number
const length = x =>
  x.length

// yell :: String -> String
const yell = x =>
  x.toUpperCase()

// Strategy :: Pair (a -> Boolean) (* -> *)
// strategies :: [ Strategy ]
const strategies = [
  Pair(isNumber, add(10)),
  Pair(isArray, length),
  Pair(isString, yell)
]

// options :: [ Strategy ] -> a -> b
const options = flip(
  x => mreduceMap(
    First,
    compose(applyTo(x), merge(safeLift))
  )
)

options(strategies, 'hello')
//=> Just "HELLO"

options(strategies, [ 1, 9, 39 ])
//=> Just 3

options(strategies, 13)
//=> Just 23

options(strategies, null)
//=> Nothing
```

### compose2

`crocks/combinators/compose2`

```haskell
compose2 :: (c -> d -> e) -> (a -> c) -> (b -> d) -> a -> b -> e
```

`compose2` allows for composition between a `binary` function and
two `unary` functions. `compose2` takes a `binary` function followed by
two `unary` functions and returns a `binary` function that maps the first
argument with the first `unary` and the second with the second, passing
the results to the given `binary` and returning the result.

```js runkit
import compose2 from 'crocks/combinators/compose2'

import and from 'crocks/logic/and'
import applyTo from 'crocks/combinators/applyTo'
import flip from 'crocks/combinators/flip'
import hasProp from 'crocks/predicates/hasProp'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'
import safeLift from 'crocks/Maybe/safeLift'

// isNonZero :: Number -> Boolean
const isNonZero = x =>
  x !== 0

// isValidDivisor :: Number -> Boolean
const isValidDivisor =
  and(isNumber, isNonZero)

// divideBy :: Number -> Number -> Number
const divideBy = x => y =>
  y / x

// safeDivide :: Number -> Number -> Maybe Number
const safeDivide = compose2(
  liftA2(divideBy),
  safe(isValidDivisor),
  safe(isNumber)
)

safeDivide(0.5, 21)
//=> Just 42

safeDivide('0.5', 21)
//=> Nothing

safeDivide(0.5, '21')
//=> Nothing

safeDivide(29, 0)
//=> Just 0

safeDivide(0, 29)
//=> Nothing

// Item :: { id: Integer }
// Items :: Array Item
const items =
  [ { id: 2 }, { id: 1 } ]

// pluck :: String -> Array Object -> Maybe a
const pluck =
  compose2(applyTo, prop, flip(map))

pluck('id', items)
//=> [ Just 2, Just 1 ]

// summarize :: String -> String -> String
const summarize = name => count =>
  `${name} purchased ${count} items`

// getLength :: a -> Maybe Number
const getLength = safeLift(
  hasProp('length'),
  x => x.length
)

// createSummary :: Person -> Array Item -> String
const createSummary = compose2(
  liftA2(summarize),
  prop('name'),
  getLength
)

createSummary({
  name: 'Sam Smith'
}, items)
//=> Just "Sam Smith purchased 2 items"

// capitalize :: String -> String
const capitalize = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`

// join :: String -> String -> String -> String
const join = delim => right => left =>
  `${left}${delim}${right}`

// toUpper :: String -> String
const toUpper = x =>
  x.toUpperCase()

// createName :: String -> String -> String
const createName =
  compose2(join(', '), capitalize, toUpper)

createName('Jon', 'doe')
//=> DOE, Jon

createName('sara', 'smith')
//=> SMITH, Sara
```

### composeB

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

```js runkit
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

### constant

`crocks/combinators/constant`

```haskell
constant :: a -> () -> a
```

This is a very handy dandy function, used a lot. Pass it any value and it will
give you back a function that will return that same value no matter what you
pass it.
`constant` is perfect for those moments where you need to pass a function but
do not care about the input. `constant` will swallow any value given to it and
always return the initial value it was given.
It is important to note that any function that is passed into `constant` will
get the added benefit of having [`curry`][curry] applied to it.

```js runkit
import constant from 'crocks/combinators/constant'

import Result from 'crocks/Result'

import bimap from 'crocks/pointfree/bimap'
import composeB from 'crocks/combinators/composeB'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import getPropOr from 'crocks/helpers/getPropOr'

const { Ok, Err } = Result

// whatsTheAnswer :: () -> Number
const whatsTheAnswer =
  constant(42)

whatsTheAnswer('to life?')
//=> 42

whatsTheAnswer('to the universe?')
//=> 42

whatsTheAnswer('to everything?')
//=> 42

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// getLength :: Result a String -> Result Number
const getLength = bimap(
  constant(0), getPropOr(0, 'length')
)

// getLengthOfString :: a -> Result a String
const getLengthOfString = composeB(
  getLength,
  ensure(isString)
)

getLengthOfString('testing')
//=> Ok 7

getLengthOfString(42)
//=> Err 0

getLengthOfString([ 1, 2, 3, 4 ])
//=> Err 0
```

### converge

`crocks/combinators/converge`

```haskell
converge :: (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
```

Provides a means of passing an acculumating function and two branching functions.
A value can be applied to the resulting function which will then be applied to
each branching function, the results of which will be applied to the accumulating
function.

```js runkit
import converge from 'crocks/combinators/converge'

import alt from 'crocks/pointfree/alt'
import getProp from 'crocks/Maybe/getProp'
import liftA2 from 'crocks/helpers/liftA2'
import getPropOr from 'crocks/helpers/getPropOr'

// data :: [ Number ]
const data = [ 1, 2, 3, 4, 5 ]

// divide :: Number -> Number -> Number
const divide = x => y =>
  y / x

// add :: (Number, Number) -> Number
const add = (a, b) =>
  b + a

// sum :: [ Number ] -> Number
const sum = xs =>
  xs.reduce(add, 0)

// length :: [ a ] -> Number
const length =
  getPropOr(0, 'length')

// average :: [ Number ] -> Number
const average =
  converge(divide, length, sum)

average(data)
//=> 3

// maybeGetDisplay :: a -> Maybe b
const maybeGetDisplay =
  getProp('display')

// maybeGetFirst :: a -> Maybe b
const maybeGetFirst =
  getProp('first')

// maybeGetLast :: a -> Maybe b
const maybeGetLast =
  getProp('last')

// buildFullName :: String -> String -> String
const buildFullName = surname => firstname =>
  `${firstname} ${surname}`

// maybeConcatStrings :: Maybe String -> Maybe String -> Maybe String
const maybeBuildFullName = a => b =>
  liftA2(buildFullName, a, b)
    .alt(a)
    .alt(b)

// maybeMakeDisplay :: a -> Maybe String
const maybeMakeDisplay = converge(
  maybeBuildFullName,
  maybeGetLast,
  maybeGetFirst
)

// maybeGetName :: a -> Maybe b
const maybeGetName =
  converge(alt, maybeMakeDisplay, maybeGetDisplay)

maybeGetName({ display: 'Jack Sparrow' })
//=> Just "Jack Sparrow"

maybeGetName({ first: 'J', last: 'S' })
//=> Just "J S"

maybeGetName({ display: 'Jack Sparrow', first: 'J', last: 'S' })
//=> Just "Jack Sparrow"

maybeGetName({ first: 'J' })
//=> Just "J"

maybeGetName({ first: 'S' })
//=> Just "S"
```

### flip

`crocks/combinators/flip`

```haskell
flip :: (a -> b -> c) -> b -> a -> c
```

This little function just takes a function and returns a function that takes
the first two parameters in reverse. `flip` is perfectly suited for those
moments where you have the context of your function but not the data.
Applying `flip` to the function will allow you to pass in your context and will
return a function waiting for the data. This will happen often when you're
using composition.

When required, one can compose flip calls down the line to flip all, or some of
the other parameters if there are more than two. Mix and match to your heart's
desire.

```js runkit
import flip from 'crocks/combinators/flip'

import Pred from 'crocks/Pred'

import composeB from 'crocks/combinators/composeB'
import concat from 'crocks/pointfree/concat'
import isNumber from 'crocks/predicates/isNumber'
import mconcat from 'crocks/helpers/mconcat'
import runWith from 'crocks/pointfree/runWith'

concat('first param. ', 'second param. ')
//=> "second param. first param. ""

flip(concat, 'first param. ', 'second param. ')
//=> "first param. second param. ""

// checkAll :: [ a -> Boolean ] -> a -> Boolean
const checkAll =
  composeB(flip(runWith), mconcat(Pred))

// lte :: Number -> Number -> Boolean
const lte = a => b =>
  b <= a

// gte :: Number -> Number -> Boolean
const gte = a => b =>
  b >= a

// between2and10 :: a -> Boolean
const between2and10 = checkAll([
  isNumber,
  gte(2),
  lte(10)
])

between2and10(8)
//=> true

between2and10(11)
//=> false

between2and10(1)
//=> false

between2and10('not a number')
//=> false
```

### identity

`crocks/combinators/identity`

```haskell
identity ::  a -> a
```

This function and [`constant`](#constant) are the workhorses of writing code
with this library. It quite simply is just a function that when you pass it
something, it returns that thing right back to you. So simple, I will leave it
as an exercise to reason about why this is so powerful and important.

### psi

`crocks/combinators/psi`

```haskell
psi ::  (b -> b -> c) -> (a -> b) -> a -> a -> c
```

`psi` is a function that can be considered the sister of [`converge`](#converge).
Where [`converge`](#converge) takes one argument and maps it through
two `unary` functions, merging the resulting values with a binary
function, `psi` takes two arguments and runs them each through the
same `unary` function before merging them with the given binary function.

`psi` is often used to [`compose`][compose] equality checking functions
or when needing to validate two arguments of the same type.

```js runkit
import psi from 'crocks/combinators/psi'

import and from 'crocks/logic/and'
import equals from 'crocks/pointfree/equals'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import safe from 'crocks/Maybe/safe'

// isNonZero :: Number -> Boolean
const isNonZero = x =>
  x !== 0

// isValidDivisor :: Number -> Boolean
const isValidDivisor =
  and(isNumber, isNonZero)

// divideBy :: Number -> Number -> Number
const divideBy = x => y =>
  y / x

// safeDivide :: Number -> Number -> Maybe Number
const safeDivide =
  psi(liftA2(divideBy), safe(isValidDivisor))

safeDivide(0.5, 21)
//=> Just 42

safeDivide('0.5', 21)
//=> Nothing

safeDivide(0.5, '21')
//=> Nothing

safeDivide(29, 0)
//=> Nothing

// capitalize :: String -> String
const capitalize = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`

// join :: String -> String -> String -> String
const join = delim => right => left =>
  `${left}${delim}${right}`

// createName :: String -> String -> String
const createName =
  psi(join(', '), capitalize)

createName('Jon', 'doe')
//=> Doe, Jon

createName('sara', 'smith')
//=> Smith, Sara

// toLowerCase :: String -> String
const toLowerCase = str =>
  str.toLowerCase()

// equalsIgnoreCase :: String -> String -> Boolean
const equalsIgnoreCase =
  psi(equals, toLowerCase)

equalsIgnoreCase('test', 'TEst')
//=> true

equalsIgnoreCase('test', 'not-test')
//=> false
```

### substitution

`crocks/combinators/substitution`

```haskell
substitution :: (a -> b -> c) -> (a -> b) -> a -> c
```

While it may seem like a complicated little bugger, `substitution` can come in
very handy from time to time. `substitution` is used when you have a `binary` function
and you can supply the first argument and can use that value to create the
second argument. It first takes a `binary` function followed by a `unary` function
for it's first two arguments. This will return a function that is ready to take
some context, `a`. Once supplied the fun starts, it will pass the given `a` to
the `binary` and `unary` functions, and will then apply the result of
the `unary` function as the second parameter of the `binary` function. Finally
after all that juggling, it will return the result of that `binary` function.

When used with partial application on that first parameter, a whole new world
of combinatory madness is presented!

```js runkit
import substitution from 'crocks/combinators/substitution'

import composeB from 'crocks/combinators/composeB'
import curry from 'crocks/core/curry'

// getDetails :: String -> Number -> String
const getDetails = curry((text, length) =>
  `The given text "${text}" has a length of ${length}`
)

// getLength :: a -> Number
const getLength = s =>
  s.length

substitution(getDetails, getLength, 'testing')
//=> "The given text \"testing\" has a length of 7"

// getLastIndex :: a -> Number
const getLastIndex = composeB(
  x => x - 1,
  getLength
)

// slice :: Array -> Number -> Array
const slice = curry((arr, index) =>
  arr.slice(index))

substitution(slice, getLastIndex, [ 1, 2, 3, 4, 5 ])
//=> [ 5 ]
```

[compose]: ./helpers.html#compose
[curry]: ./helpers.html#curry
