---
description: "Logic Functions API"
layout: "notopic"
title: "Logic Functions"
functions: ["and", "ifelse", "implies", "not", "or", "unless", "when"]
weight: 30
---

The functions in this section are used to represent logical branching in a
declarative manner. Each of these functions require either [`Pred`][pred]s or
predicate functions in their input. Since these functions work
with [`Pred`][pred]s and predicate functions, rather than values, this allows
for composeable, "lazy" evaluation. All logic functions can be referenced
from `crocks/logic`

### and

```haskell
and :: ((a -> Boolean) | Pred a) -> ((a -> Boolean) | Pred a) -> a -> Boolean
```

Say you have two predicate functions or [`Pred`][pred]s and would like to
combine them into one predicate over conjunction, well you came to the right
place, `and` accepts either predicate functions or [`Pred`][pred]s and will
return you a function ready to take a value. Once that value is passed, it will
run it through both of the predicates and return the result of combining it over
a `logical and`. This is super helpful when combined with `or` for putting
together reusable, complex predicates. As they follow the general form
of `(a -> Boolean)` they are easily combined with other logic functions.

```js runkit
//  p | q | p && q
// ================
//  T | T |   T
//  T | F |   F
//  F | T |   F
//  F | F |   F

import and from 'crocks/logic/and'

import constant from 'crocks/combinators/constant'
import isArray from 'crocks/predicates/isArray'
import isEmpty from 'crocks/predicates/isEmpty'
import isNumber from 'crocks/predicates/isNumber'
import not from 'crocks/logic/not'

// gte :: Number -> Number -> Boolean
const gte = x => y =>
  y >= x

// isLegalDrinkingAge :: Number -> Boolean
const isLegalDrinkingAge =
    and(isNumber, gte(21))

// isValid :: a -> Boolean
const isValid =
  and(isArray, not(isEmpty))

isLegalDrinkingAge(18)
//=> false

isLegalDrinkingAge(21)
//=> true

isValid([ 42 ])
//=> true

isValid(null)
//=> false

isValid([])
//=> false

and(constant(true), constant(true), 'ignored')
//=> true

and(constant(true), constant(false), 'ignored')
//=> false

and(constant(false), constant(true), 'ignored')
//=> false

and(constant(false), constant(false), 'ignored')
//=> false
```

### ifElse

```haskell
ifElse :: ((a -> Boolean) | Pred a) -> (a -> b) -> (a -> b) -> a -> b
```

Whenever you need to modify a value based some condition and want a functional
way to do it without some imperative `if` statement, then reach for `ifElse`.
This function take a predicate (some function that returns a `Boolean`) and two
functions. The first is what is executed when the predicate is true, the second
on a false condition. This will return a function ready to take a value to run
through the predicate. After the value is evaluated, it will be ran through it's
corresponding function, returning the result as the final result. This function
comes in really handy when creating lifting functions for Sum Types
(like `Either` or [`Maybe`][maybe]).

```js runkit
import ifElse from 'crocks/logic/ifElse'

import Maybe from 'crocks/Maybe'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import isArray from 'crocks/predicates/isArray'
import isNumber from 'crocks/predicates/isNumber'

const { Just, Nothing } = Maybe

// safe :: (a -> Boolean) -> a -> Maybe a
const safe = pred =>
  ifElse(pred, Just, Nothing)

// gte :: Number -> Number -> Maybe Number
const gte = x =>
  safe(n => n >= x)

// isLarge :: a -> Maybe a
const isLarge =
  compose(chain(gte(42)), safe(isNumber))

// ensureArray :: a -> Array
const ensureArray =
  ifElse(isArray, identity, () => [])

isLarge(10)
//=> Nothing

isLarge(44)
//=> Just 44

ensureArray('nope')
  .map(x => x + x)
//=> []

ensureArray([ 3 ])
  .map(x => x + x)
//=> [ 6 ]
```

### implies

```haskell
implies :: ((a -> Boolean) | Pred a) -> ((a -> Boolean) | Pred a) -> a -> Boolean
```

`implies` is a logic combinator that will combine the evaluation of two
predicates over `logical implication`. It takes any combination of predicate
functions or [`Pred`][pred]s as its first two arguments and will return a new
predicate function that will return `false` when the first predicate evaluates
to `true` and the second evaluates to `false`. All other combinations will
return `true`.

Implication is a very weak condition in regards to assertion of a value and is
usually paired with disjunction over conjunction for types
like [`Pred`][pred] and the [`All`][all] `Monoid`.

```js runkit
//  p | q | p -> q
// ================
//  T | T |   T
//  T | F |   F
//  F | T |   T
//  F | F |   T

import implies from 'crocks/logic/implies'

import Pred from 'crocks/Pred'

import isArray from 'crocks/predicates/isArray'
import isString from 'crocks/predicates/isString'
import not from 'crocks/logic/not'
import or from 'crocks/logic/or'
import safe from 'crocks/Maybe/safe'

// length :: (String | Array) -> Number
const length = x =>
  x.length

// stringOrArray :: a -> Pred a
const stringOrArray =
  Pred(or(isArray, isString))

// stringLength :: a -> Pred a
const stringLength =
  Pred(implies(isString, length))

// emptyArray :: a -> Pred a
const emptyArray =
  Pred(implies(isArray, not(length)))

stringOrArray
  .runWith('')
//=> true

stringOrArray
  .runWith([ 1, 2, 3 ])
//=> true

stringOrArray
  .runWith(23)
//=> false

stringLength
  .runWith('')
//=> false

stringLength
  .runWith('with length')
//=> true

stringLength
  .runWith([ 1, 3 ])
//=> true

emptyArray
  .runWith([ 1, 3 ])
//=> false

emptyArray
  .runWith([])
//=> true

emptyArray
  .runWith(23)
//=> true

// pred :: a -> Pred a
const pred =
  stringOrArray
    .concat(stringLength)
    .concat(emptyArray)

// isValid :: a -> Maybe (String | Array)
const isValid =
  safe(pred)

isValid(34)
//=> Nothing

isValid([ 1, 3 ])
//=> Nothing

isValid('')
//=> Nothing

isValid([])
//=> Just []

isValid('valid')
//=> Just "valid"
```

### not
```haskell
not :: ((a -> Boolean) | Pred) -> a -> Boolean
```

When you need to negate a predicate function or a [`Pred`][pred], but want a new
predicate function that does the negation, then `not` is going to get you what
you need. Using `not` will allow you to stay as declarative as possible. Just
pass `not` your predicate function or a [`Pred`][pred], and it will give you
back a predicate function ready for insertion into your flow. All predicate
based functions in `crocks` take either a [`Pred`][pred] or predicate
function, so it should be easy to swap between the two.

```js runkit
//  p | !p
// ========
//  T | F
//  F | T

import not from 'crocks/logic/not'

import Pred from 'crocks/Pred'

import and from 'crocks/logic/and'
import compose from 'crocks/helpers/compose'
import flip from 'crocks/combinators/flip'
import identity from 'crocks/combinators/identity'
import isString from 'crocks/predicates/isString'
import propSatisfies from 'crocks/predicates/propSatisfies'

// isFalsy :: a -> Boolean
const isFalsy =
  not(identity)

// isTruthy :: a -> Boolean
const isTruthy =
  not(isFalsy)

isTruthy('Test string')
//=> true

isTruthy('')
//=> false

isFalsy('')
//=> true

isFalsy('Test string')
//=> false

// User :: { email: String, firstName: String, lastName: String}

// validUser :: User
const validUser = {
  email: 'testuser@email.com',
  firstName: 'Tom',
  lastName: 'Smith'
}

// invalidUser :: User
const invalidUser = {
  email: '',
  firstName: '',
  lastName: 'Smith'
}

// isNonEmptyString :: a -> Boolean
const isNonEmptyString =
  and(isString, isTruthy)

// hasValidStringProp :: String -> User -> Boolean
const hasValidStringProp = compose(
  Pred,
  flip(propSatisfies, isNonEmptyString)
)

// hasName :: User -> Boolean
const hasName =
  hasValidStringProp('firstName')

// hasEmail :: User -> Boolean
const hasEmail =
  hasValidStringProp('email')

// isUserInvalid :: User -> Boolean
const isUserInvalid =
  Pred(not(hasName))
    .concat(Pred(not(hasEmail)))

isUserInvalid
  .runWith(invalidUser)
//=> true

isUserInvalid
  .runWith(validUser)
//=> false
```

### or

```haskell
or :: ((a -> Boolean) | Pred) -> ((a -> Boolean) | Pred) -> a -> Boolean
```

Say you have two predicate functions or [`Pred`][pred]s and would like to
combine them into one predicate over disjunction, look no further, `or` accepts
either predicate functions or [`Pred`][pred]s and will return you a function '
ready to take a value. Once that value is passed, it will run it through both of
the predicates and return the result of combining it over a `logical or`. This
is super helpful when combined with `and` for putting together reusable, complex
predicates. As they follow the general form of `(a -> Boolean)` they are easily
combined with other logic functions.

```js runkit
//  p | q | p || q
// ================
//  T | T |   T
//  T | F |   T
//  F | T |   T
//  F | F |   F

import or from 'crocks/logic/or'

import constant from 'crocks/combinators/constant'
import isEmpty from 'crocks/predicates/isEmpty'
import not from 'crocks/logic/not'
import propSatisfies from 'crocks/predicates/propSatisfies'
import pathSatisfies from 'crocks/predicates/pathSatisfies'

or(constant(true), constant(true), 'ignored')
//=> true

or(constant(true), constant(false), 'ignored')
//=> true

or(constant(false), constant(true), 'ignored')
//=> true

or(constant(false), constant(false), 'ignored')
//=> false

// Response :: { error: String, response: { users: [ * ] } }

// createResponse :: ([ * ], String) -> Response
const createResponse = (users, error = '') => ({
  error,
  response: {
    users
  }
})

// hasData :: Response -> Boolean
const hasData = or(
  propSatisfies('error', isEmpty),
  pathSatisfies([ 'response', 'users' ], not(isEmpty))
)

hasData(createResponse([ { name: 'User 1' } ]))
//=> true

hasData(createResponse([], 'No users found'))
//=> false

```

### unless

```haskell
unless :: ((a -> Boolean) | Pred) -> (a -> a) -> a -> a
```

There may come a time when you need to adjust a value when a condition is false,
that is where `unless` can come into play. Just provide a predicate function (a
function that returns a `Boolean`) and a function to apply your desired
modification. This will get you back a function that when you pass it a value,
it will evaluate it and if false, will run your value through the provided
function. Either the original or modified value will be returned depending on
the result of the predicate. Check out [`when`](#when) for a negated version of
this function.

```js runkit
import unless from 'crocks/logic/unless'

import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import isString from 'crocks/predicates/isString'

// double :: Number -> Number
const double = a =>
  a * 2

// doubleUnless :: (a -> Boolean) -> Number -> Number
const doubleUnless =
  flip(unless, double)

doubleUnless(constant(true), 21)
//=> 21

doubleUnless(constant(false), 21)
//=> 42

// toString :: a -> String
const toString = x =>
  x.toString()

// ensureString :: a -> String
const ensureString =
  unless(isString, toString)

// testData :: [ * ]
const testData =
  [ 1, 2, '3', 4, true, false, new Date(1770, 3, 29) ]

testData.map(ensureString)
//=> [ '1', '2', '3', '4', 'true', 'false', 'Sun Apr 29 1770 00:00:00 GMT-0752 (Pacific Daylight Time)' ]
```

### when

```haskell
when :: ((a -> Boolean) | Pred) -> (a -> a) -> a -> a
```

There may come a time when you need to adjust a value when a condition is true,
that is where `when` can come into play. Just provide a predicate function (a
function that returns a `Boolean`) and a function to apply your desired
modification. This will get you back a function that when you pass it a value,
it will evaluate it and if true, will run your value through the provided
function. Either the original or modified value will be returned depending on
the result of the predicate. Check out [`unless`](#unless) for a negated version
of this function.

<!-- eslint-disable no-console -->

```js runkit
import when from 'crocks/logic/when'

import compose from 'crocks/helpers/compose'
import composeB from 'crocks/combinators/composeB'
import constant from 'crocks/combinators/constant'
import curry from 'crocks/helpers/curry'
import flip from 'crocks/combinators/flip'
import mapProps from 'crocks/helpers/mapProps'

// gt :: Number -> Number -> Boolean
const gt = a => b =>
  b > a

// subtract :: Number -> Number
const subtract = a => b =>
  b - a

// protectedSubtract :: Number -> Number -> Number
const protectedSubtract = curry(
  composeB(when(gt(0)),subtract)
)

protectedSubtract(10, 30)
//=> 20

protectedSubtract(10, -5)
//=> -5

// smallExplosion :: Number -> Number
const smallExplosion =
  protectedSubtract(15)

// largeExplosion :: Number -> Number
const largeExplosion = compose(
  smallExplosion,
  smallExplosion,
  smallExplosion
)

// Player :: { health: Number }
// player :: Player
const player = {
  health: 30
}

// affectHealth :: (Number -> Number) -> Player -> Player
const affectHealth = curry(
  fn => mapProps({ health: fn })
)

affectHealth(smallExplosion, player)
//=> { health: 15 }

affectHealth(largeExplosion, player)
//=> { health: 0 }

// double :: Number -> Number
const double = a =>
  a * 2

// doubleWhen :: (a -> Boolean) -> Number -> Number
const doubleWhen =
  flip(when, double)

doubleWhen(constant(true), 21)
//=> 42

doubleWhen(constant(false), 21)
//=> 21
```

[all]: ../monoids/All
[maybe]: ../crocks/Maybe
[pred]: ../crocks/Pred
