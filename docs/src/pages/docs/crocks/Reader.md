---
title: "Reader"
description: "Reader Crock"
layout: "guide"
weight: 110
---

```haskell
Reader e a
```

`Reader` is a lazy Product Type that enables the  composition of computations
that depend on a shared environment `(e -> a)`. The left portion, the `e` must
be fixed to a type for all related computations. The right portion `a` can vary
in its type.

As `Reader` is lazy, wrapping a function of the form `(e -> a)`, nothing is
executed until it is run with an environment. `Reader` provides a method on
it's instance that will take an environment called [`runWith`](#runwith) that
will run the instance with a given environment.

Not only is `Reader`'s environment fixed to a type, but it should be immutable
for the "life" computation. If a referential type is used as the environment
great care should be taken to not modify the value of the environment.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const concat = require('crocks/pointfree/concat')

// greet :: String -> Reader String String
const greet = greeting =>
  Reader(name => `${greeting}, ${name}`)

// addFarewell :: String -> Reader String String
const addFarewell = farewell => str =>
  ask(env => `${str}${farewell} ${env}`)

// flow :: Reader String String
const flow =
  greet('Hola')
    .map(concat('...'))
    .chain(addFarewell('See Ya'))

flow
  .runWith('Thomas')
// => Hola, Thomas...See Ya Thomas

flow
  .runWith('Jenny')
// => Hola, Jenny...See Ya Jenny
```
<article id="topic-implements">

## Implements
`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-constructor">

## Constructor Methods

#### ask

```haskell
Reader.ask :: () -> Reader e e
Reader.ask :: (e -> b) -> Reader e b
```

A construction helper that returns a `Reader` with the environment on the right
portion of the `Reader`. `ask` can take a function, that can be used to map the
environment to a different type or value.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// Typical constructor
Reader(add(10))
  .runWith(56)
//=> 66

// Using `ask` with no function
// (identity on environment)
ask()
  .runWith(56)
//=> 56

// Using `ask` with a function
// (map environment before deposit)
ask(add(10))
  .runWith(56)
//=> 66
```

#### of

```haskell
Reader.of :: a -> Reader e a
```

`of` is used to construct a `Reader` with the right portion populated with it's
argument. `of` essentially will lift a value of type `a` into a `Reader`, giving
back a `Reader` that is "pointed" to the specific value provided. `of` makes
for a wonderful starting point for some of the more complicated flows.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const objOf = require('crocks/helpers/objOf')
const thrush = require('crocks/combinators/reverseApply')

// add :: Number -> Number -> Number
const add =
  x => y => x + y

Reader.of(34)
  .map(add(6))
  .runWith()
//=> 40

Reader.of('Bobby')
  .map(objOf('name'))
  .runWith()
//=> { name: 'Bobby' }

Reader.of(57)
  .chain(x => ask(add).map(thrush(x)))
  .runWith(43)
//=> 100
```

#### type

```haskell
Reader.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be useful
to the end user for debugging and building out custom types based on the standard
`crocks` types. While type comparisons can easily be done manually by calling
`type` on a given type, using the `isSameType` function hides much of the
boilerplate. `type` is available on both the Constructor and the Instance for
convenience.

```javascript
const Reader = require('crocks/Reader')
const Identity = require('crocks/Identity')

const I = require('crocks/combinators/identity')
const isSameType = require('crocks/predicates/isSameType')

Reader.type() //=> 'Reader'

isSameType(Reader, Reader.of(76))   //=> true
isSameType(Reader, Reader)          //=> true
isSameType(Reader, Identity(0))     //=> false
isSameType(Reader(I), Identity)     //=> false
```

</article>

<article id="topic-instance">

## Instance Methods

#### map

```haskell
Reader e a ~> (a -> b) -> Reader e b
```

While the left side, or the environment, of the `Reader` must always be fixed
to the same type, the right side, or value, of the `Reader` may vary. Using `map`
allows a function to be lifted into the `Reader`, mapping the result into the
result of the lifted function.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const assign = require('crocks/helpers/assign')
const B = require('crocks/combinators/composeB')
const objOf = require('crocks/helpers/objOf')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')

// length :: Array -> Number
const length =
  x => x.length

ask()
  .map(length)
  .runWith([ 1, 2, 3 ])
//=> 3

// propOr :: (String, a) -> b -> a
const propOr = (key, def) =>
  B(option(def), prop(key))

// lengthObj :: Array -> Object
const lengthObj =
  B(objOf('length'), length)

// addLength :: Object -> Redaer Array Object
const addLength = x =>
  ask(propOr('list', []))
    .map(B(assign(x), lengthObj))

Reader.of({ num: 27 })
  .chain(addLength)
  .runWith({ list: [ 1, 2, 3 ] })
//=> { length: 3, num: 27 }
```

#### ap

```haskell
Reader e (a -> b) ~> Reader e a -> Reader e b
```

`ap` allows for values wrapped in a `Reader` to be applied to functions also
wrapped in a `Reader`. In order to use `ap`, the `Reader` must contain a
function as its value. Under the hood, `ap` unwraps both the function
and the value to be applied and applies the value to the function. Finally it
will wrap the result of that application back into a `Reader`. It is required
that the inner function is curried.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const B = require('crocks/combinators/composeB')
const assign = require('crocks/helpers/assign')
const liftA2 = require('crocks/helpers/liftA2')
const objOf = require('crocks/helpers/objOf')

// namePart :: Number -> String -> String
const namePart = indx => x =>
  x.split(' ')[indx] || ''

// combine :: Object -> Reader Object
const combine =
  x => ask(assign(x))

// full :: Reader Object
const full =
  ask(({ full }) => full)

// first :: Reader Object
const first =
  full
    .map(B(objOf('first'), namePart(0)))

// last :: Reader Object
const last =
  full
    .map(B(objOf('last'), namePart(1)))

// fluent style
Reader.of(assign)
  .ap(first)
  .ap(last)
  .chain(combine)
  .runWith({ full: 'Mary Jones' })
//=> { full: 'Mary Jones', first: 'Mary', last: 'Jones' }

// liftAssign :: Reader Object -> Reader Object -> Reader Object
const liftAssign =
  liftA2(assign)

// using a lift function
liftAssign(first, last)
  .chain(combine)
  .runWith({ full: 'Tom Jennings' })
//=> { full: 'Tom Jennings', first: 'Tom', last: 'Jennings' }
```

#### chain

```haskell
Reader e a ~> (a -> Reader e b) -> Reader e b
```

One of the ways `Monad`s like `Reader` are able to be combined and have their
effects applied, is by using the `chain` method. In the case of `Reader`, the
effect is to read in and make available the shared environment. `chain` expects
a function that will take any `a` and return a new `Reader` with a value of `b`.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const B = require('crocks/combinators/composeB')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')

// multiply :: Number -> Number -> Number
const multiply =
  x => y => x * y

// add :: Number -> Number -> Number
const add  =
  x => y => x + y

// propOr :: (String, a) -> b -> a
const propOr = (key, def) =>
  B(option(def), prop(key))

// applyScale :: Number -> Reader Object Number
const applyScale = x =>
  ask(propOr('scale', 1))
    .map(multiply(x))

// applyScale :: Number -> Reader Object Number
const applyOffset = x =>
  ask(propOr('offset', 0))
    .map(add(x))

// applyTransforms :: Number -> Reader Object Number
const applyTransform = x =>
  Reader.of(x)
    .chain(applyOffset)
    .chain(applyScale)

applyTransform(45)
  .runWith({})
//=> 45

applyTransform(45)
  .runWith({ offset: 20 })
//=> 65

applyTransform(45)
  .runWith({ scale: 2 })
//=> 90

applyTransform(45)
  .runWith({ scale: 2, offset: 20 })
//=> 130
```

#### runWith

```haskell
Reader e a ~> e -> a
```

As `Reader` is a lazy datatype that requires a shared environment to run, it's
instance provides a `runWith` method that takes in an environment and returns
the result of the computation.

```javascript
const { ask } = require('crocks/Reader')
const Pair = require('crocks/Pair')

const fst = require('crocks/Pair/fst')
const liftA2 = require('crocks/helpers/liftA2')
const snd = require('crocks/Pair/snd')

// data :: Pair Number Number
const data =
  Pair(20, 45)

// getCorrect :: Reader (Pair Number Number) Number
const getCorrect =
  ask(fst)

// getTotal :: Reader (Pair Number Number) Number
const getTotal =
  ask(snd)

// divide :: Number -> Number -> Number
const divide =
  x => y => x / y

// formatPercent :: Number -> String
const formatPercent =
  x => `${Math.floor(x * 1000) / 10}%`

// calcPercent :: Reader (Pair Number Number) String
const calcPercent =
  liftA2(divide, getCorrect, getTotal)
    .map(formatPercent)

calcPercent
  .runWith(data)
//=. '44.4%'
```

</article>
