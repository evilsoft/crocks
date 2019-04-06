---
title: "Equiv"
description: "Equiv Crock"
layout: "guide"
weight: 50
---

```haskell
Equiv a a Boolean
```

Defined as a Monoidal Contravariant datatype, `Equiv` can be used to test
equivalence between two values of a given type. It does this by wrapping a
binary equivalence function of the form `(a, a) -> Boolean`. Most of the time
strict equality is used, but other functions of the required form can provide
some powerful results.

While the far right parameter is always fixed to `Boolean` it cannot be
Covariant, but is Contravariant allowing both inputs to vary in their type.
`Equiv` is also a [`Monoid`][monoids] and will concat the results of two `Equiv`s
under logical conjunction, with it's empty value always returning `true`.

As `Equiv` wraps a function, it is lazy and a given instance will not produce
a result until both arguments are satisfied. A given instance can be run by
calling the method [`compareWith`](#comparewith), providing both values for
comparison.

```javascript
import Equiv from 'crocks/Equiv'

import equals from 'crocks/pointfree/equals'

// toString :: a -> String
const toString =
  x => x.toString()

// length :: a -> Number
const length = x =>
  x && x.length ? x.length : 0

// eq :: Equiv a a
const eq =
  Equiv(equals)

eq.contramap(toString)
  .compareWith('123', 123)
//=> true

eq.contramap(length)
  .compareWith([ 1, 2, 3 ], [ 'a', 'b' ])
//=> false
```

<article id="topic-implements">

## Implements
`Semigroup`, `Monoid`, `Contravariant`

</article>

<article id="topic-construction">

## Construction

```haskell
Equiv :: ((a, a) -> Boolean)-> Equiv a a
```

The constructor for `Equiv` is a unary function that takes a binary predicate
function as its argument. The binary function's arguments should be the same
type, although a union of multiple types can be used.

The `Equiv` type is parameterized by the inputs, or domain, of the function it
was constructed with. If the function does not strictly return a `Boolean`, then
the underlying result will be coerced to a `Boolean`.

```javascript
import Equiv from 'crocks/Equiv'

// samePartition :: (a -> b) -> (a, a) -> Boolean
const samePartition = fn => (x, y) =>
  fn(x) === fn(y)

// mod12 :: Integer -> Integer
const mod12 =
  x => x % 12

// Equiv Integer Integer
Equiv(samePartition(mod12))
//=> Equiv (Integer, Integer) -> Boolean
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Equiv.empty :: () -> Equiv a a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Equiv` the result of `empty` is an `Equiv` that will always return
`true`. `empty` is available on both the Constructor and the Instance for
convenience.

```javascript
import Equiv from 'crocks/Equiv'

import equals from 'crocks/pointfree/equals'

const eq =
  Equiv(equals)

const empty =
  Equiv.empty()

eq
  .concat(empty)
  .compareWith({ a: 32 }, { a: 32 })
//=> true

empty
  .concat(eq)
  .compareWith({ a: 32 }, { a: 32 })
//=> true

empty
  .concat(eq)
  .compareWith({ a: 32, b: 19 }, { a: 32 })
//=> false
```

</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Equiv a a ~> Equiv a a -> Equiv a a
```

`concat` is used to combine two `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Equiv`, the results of both
`Equiv`s are combined under logical conjunction.

```javascript
import Equiv from 'crocks/Equiv'

import compareWith from 'crocks/pointfree/compareWith'
import equals from 'crocks/pointfree/equals'
import isSameType from 'crocks/predicates/isSameType'
import getPropOr from 'crocks/helpers/getPropOr'

// objLength :: Object -> Number
const objLength =
  x => Object.keys(x).length

// eq :: Equiv a a
const eq =
  Equiv(equals)

// sameType :: Equiv a a
const sameType =
  Equiv(isSameType)

// sameType :: Equiv Object Object
const length =
  eq.contramap(objLength)

// sameType :: Equiv a a
const sameTypeProp = key =>
  sameType.contramap(getPropOr(null, key))

// run :: Equiv Object Object
const run = compareWith(
  { a: 19, b: 'string' },
  { a: 32, c: false }
)

run(length)
//=> true

run(sameTypeProp('a'))
//=> true

run(sameTypeProp('b'))
//=> false

run(
  sameTypeProp('a')
    .concat(length)
)
// true

run(
  sameTypeProp('b')
    .concat(length)
)
// false
```

#### contramap

```haskell
Equiv a a ~> (b -> a) -> Equiv b b
```

The far right parameter of `Equiv` fixed to `Boolean` which means we cannot map
the value as expected. However the left two parameters can vary, although they
must vary in the same manner.

This is where `contramap` comes into play as it can be used to adapt an `Equiv`
of a given type to accept a different type or modify the value. Provide it a
function that has a return type that matches the input types of the `Equiv`.
This will return a new `Equiv` matching the input type of the provided
function.

```javascript
import Equiv from 'crocks/Equiv'

import equals from 'crocks/pointfree/equals'

// length :: String -> Number
const length =
  x => x.length

// eq :: Equiv a a
const eq =
  Equiv(equals)

// sameLength :: Equiv String String
const sameLength =
  eq.contramap(length)

// sameAmplitude :: Equiv Float Float
const sameAmplitude =
  eq.contramap(Math.abs)

sameAmplitude
  .compareWith(-0.5011, 0.5011)
//=> true

sameAmplitude
  .compareWith(-0.755, 0.8023)
//=> false

sameLength
  .compareWith('aBcD', '1234')
//=> true

sameLength
  .compareWith('AB', 'ABC')
//=> false
```

#### valueOf

```haskell
Equiv a a ~> () -> a -> a -> Boolean
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on an `Equiv`
instance will result in the underlying curried equivalence function.

```javascript
import Equiv from 'crocks/Equiv'

import compose from 'crocks/helpers/compose'
import equals from 'crocks/pointfree/equals'
import getPropOr from 'crocks/helpers/getPropOr'

// toLower :: String -> String
const toLower =
  x => x.toLowerCase()

// length :: String -> String
const length =
  x => x.length

// lowerName :: Object -> String
const lowerName =
  compose(toLower, getPropOr('', 'name'))

// itemsLen :: Object -> Number
const itemsLen =
  compose(length, getPropOr('', 'items'))

// eq :: Equiv a a
const eq =
  Equiv(equals)

// checkName :: Equiv Object Object
const checkName =
  eq.contramap(lowerName)

// checkName :: Equiv Object Object
const checkItems =
  eq.contramap(itemsLen)

// test :: Object -> Object -> Boolean
const test =
  checkName
    .concat(checkItems)
    .valueOf()

test(
  { name: 'Bob', items: [ 1, 2, 4 ] },
  { name: 'bOb', items: [ 9, 12, 9 ] }
)
//=> true
```

#### compareWith

```haskell
Equiv a a ~> a -> a -> Boolean
```

As `Equiv` wraps a function, it needs a means to be run with two values for
comparison. Instances provide a curried method called `compareWith` that takes
two values for comparison and will run them through the equivalence function,
returning the resulting `Boolean`.

Due to the laziness of this type, complicated comparisons can be built out from
combining and mapping smaller, simpler units of equivalence comparison.

```javascript
import Equiv from 'crocks/Equiv'

// both :: Equiv Boolean Boolean
const both =
  Equiv((x, y) => x && y)

// isEven :: Number -> Boolean
const isEven =
  x => x % 2 === 0

// isBig :: Number -> Boolean
const isBig =
  x => x > 10

// bothEven :: Equiv Number Number
const bothEven =
  both.contramap(isEven)

// bothBig :: Equiv Number Number
const bothBig =
  both.contramap(isBig)

bothEven
  .compareWith(12, 20)
//=> true

bothEven
  .compareWith(17, 20)
//=> false

bothBig
  .compareWith(17)(20)
//=> true

bothBig
  .compareWith(7)(20)
//=> false

bothBig
  .concat(bothEven)
  .compareWith(8)(54)
//=> false
```

</article>

[monoids]: ../monoids/index.html
