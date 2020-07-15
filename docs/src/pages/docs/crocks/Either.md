---
title: "Either"
description: "Either Crock"
layout: "guide"
functions: ["firsttoeither", "lasttoeither", "maybetoeither", "resulttoeither"]
weight: 40
---

```haskell
Either c a = Left c | Right a
```

`Either` is the canonical `Sum` type and is the base of all other `Sum` types
included in `crocks`, such as [`Maybe`][maybe] and [`Async`][async] to name a
few. Defined as a tagged union type, it captures the essence of disjunction as
it provides either a [`Left`](#left) value or a [`Right`](#right) value and not both.

Unlike [`Maybe`][maybe], which fixes its "left side", or [`Nothing`][nothing] to
a `()` (unit), `Either` is a functor in both it's [`Left`](#left) and [`Right`](#right) sides. This
allows for the ability to vary the type on either side and is akin to the
imperative `if...else` trees that are common in programming.

Like most other types in `crocks`, `Either` has a right bias in regard to
instance methods like [`map`](#map), [`ap`](#ap) and [`chain`](#chain). This behavior can be used to
formally capture Error handling as the [`Left`](#left) value will be maintained
throughout subsequent flows.

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'

const { Left, Right } = Either

// err :: a -> String
const err = val =>
  `${typeof val} is not an accepted type`

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// validate :: a -> Either String Number
const validate = ifElse(
  isNumber,
  Right,
  compose(Left, err)
)

// flow :: a -> Either String Number
const flow = compose(
  map(add(10)),
  validate
)

flow(32)
//=> Right 42

flow('32')
//=> Left "string is not an accepted type"

flow(true)
//=> Left "boolean is not an accepted type"
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Apply`, `Traversable`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Either :: a -> Either c a
```

An `Either` is typically constructed by using one of the instance constructors
provided on the `TypeRep`: [`Left`](#left) or [`Right`](#right). For consistency,
an `Either` can be constructed using its `TypeRep` as a constructor. The
constructor is a unary function that accepts any type `a` and will return a
[`Right`](#right) instance, wrapping the value it was passed.

```javascript
import Either from 'crocks/Either'
import equals from 'crocks/pointfree/equals'

Either(90)
//=> Right 90

Either.of(90)
//=> Right 90

Either.Right(90)
//=> Right 90

equals(
  Either.Right([ 1, 2, 3 ]),
  Either.of([ 1, 2, 3 ])
)
//=> true

equals(
  Either.of({ a: 100 }),
  Either({ a: 100 })
)
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Left

```haskell
Either.Left :: c -> Either c a
```

Used to construct a `Left` instance of an `Either` that represents
the `false` portion of a disjunction. The `Left` constructor takes a value of any
type and returns a `Left` instance wrapping the value passed to the constructor.

When an instance is a `Left`, most `Either` returning methods on
the instance will do nothing to the wrapped value and return another `Left` with
the same initial value the `Left` instance was constructed with.

```javascript
import Either from 'crocks/Either'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isString from 'crocks/predicates/isString'
import ifElse from 'crocks/logic/ifElse'

const { Left, Right } = Either

// yell :: String -> String
const yell =
  x => `${x.toUpperCase()}!`

// safeYell :: a -> Either a String
const safeYell =  ifElse(
  isString,
  compose(Right, yell),
  Left
)

Right('excite')
  .map(yell)
//=> Right "EXCITE!"

Left('whisper')
  .map(yell)
//=> Left "whisper"

chain(safeYell, Right('outside voice'))
//=> Right "OUTSIDE VOICE!"

chain(safeYell, Left({ level: 'inside voice' }))
//=> Left { level: 'inside voice' }
```

#### Right

```haskell
Either.Right :: a -> Either c a
```

Used to construct a `Right` instance of the an `Either` that represents
the `true` portion of a disjunction. The `Right` constructor takes any value and
will return a new `Right` instance wrapping the value provided.

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Left, Right } = Either

// validate :: (b -> Boolean) -> Either c a
const validate = pred =>
  ifElse(pred, Right, Left)

// add10 :: Number -> Number
const add10 =
  x => x + 10

Right(10)
  .map(add10)
//=> Right 20

Left('Not A Number')
  .map(add10)
//=> Left "Not A Number"

// validNumber :: b -> Either c Number
const validNumber =
  validate(isNumber)

validNumber('60')
//=> Left "60"

validNumber(null)
//=> Left null

validNumber(60)
//=> Right 60

// safeAdd10 :: b -> Either c Number
const safeAdd10 = composeK(
  compose(Right, add10),
  validNumber
)

safeAdd10([ 7 ])
//=> Left [ 7 ]

safeAdd10(null)
//=> Left null

safeAdd10(5)
//=> Right 15

// isLarge :: Number -> Either Number Number
const isLarge =
  validate(x => x >= 10)

// isLargeNumber :: b -> Either c Number
const isLargeNumber =
  composeK(isLarge, validNumber)

// add10ToLarge :: b -> Either c Number
const add10ToLarge =
  composeK(safeAdd10, isLargeNumber)

add10ToLarge()
//=> Left undefined

add10ToLarge('40')
//=> Left "40"

add10ToLarge(5)
//=> Left 5

add10ToLarge(10)
//=> Right 20
```

#### of

```haskell
Either.of :: a -> Either c a
```

Used to lift any value into an `Either` as a [`Right`](#right), `of` is used mostly by
helper functions that work "generically" with instances of
either `Applicative` or `Monad`. When working specifically with
the `Either` type, the [`Right`](#right) constructor should be used. Reach
for `of` when working with functions that will work with
ANY `Applicative`/`Monad`.

```javascript
import Either from 'crocks/Either'

const { Right } = Either

Either.of('some string')
//=> Right "some string"

Either.of(undefined)
//=> Right undefined

Either('some string')
//=> Right "some string"

Either(undefined)
//=> Right undefined

Right('some string')
//=> Right "some string"

Right(undefined)
//=> Right undefined
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Either c a ~> b -> Boolean
```

Used to compare the underlying values of two `Either` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
arguments is a `Either` of the same instance with an underlying value equal to
the underlying value of the `Either` the method is being called on. If the
passed argument is not an `Either` of the same instance or the underlying values
are not equal, `equals` will return `false`.

```javascript
import Either from 'crocks/Either'
import equals from 'crocks/pointfree/equals'

const { Left, Right } = Either

Right(null)
  .equals(Right(null))
//=> true

Left('happy')
  .equals(Left('happy'))
//=> true

Left('sad')
  .equals(Right('sad'))
//=> false

// by value, not reference for most types
Right([ 1, { a: 2 }, 'string' ])
  .equals(Right([ 1, { a: 2 }, 'string' ]))
//=> true

equals(Right('sad'), 'sad')
//=> false
```

#### concat

```haskell
Semigroup s => Either c s ~> Either c s -> Either c s
```

When an underlying [`Right`](#right) value of a given `Either` is fixed to
a `Semigroup`, `concat` can be used to concatenate  another [`Right`](#right) instance
with an underlying `Semigroup` of the same type. Expecting an `Either` wrapping
a `Semigroup` of the same type, `concat` will give back a new `Either` instance
wrapping the result of combining the two underlying `Semigroup`s. When called on
a [`Left`](#left) instance, `concat` will return a [`Left`](#left) containing the initial value.

```javascript

import Either from 'crocks/Either'

import Assign from 'crocks/Assign'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import isObject from 'crocks/predicates/isObject'
import mapReduce from 'crocks/helpers/mapReduce'

const { Left, Right } = Either

Right([ 1, 2 ])
  .concat(Right([ 4, 5 ]))
//=> Right [ 1, 2, 3, 4 ]

Right([ 1, 2 ])
  .concat(Left('Error'))
//=> Left "Error"

// lift :: Object -> Either c Assign
const lift =
  compose(Right, Assign)

// liftObject :: b -> Either c Assign
const liftObject =
  ifElse(isObject, lift, Left)

// Foldable f => fold :: f * -> Either * Assign
const fold = mapReduce(
  liftObject,
  flip(concat),
  Either(Assign.empty())
)

fold([ { a: 'a' }, { b: 'b' } ])
//=> Right Assign { a: "a", b: "b" }

fold([
  { a: 'a' }, null, { c: 'c' }
])
//=> Left null
```

#### map

```haskell
Either c a ~> (a -> b) -> Either c b
```

Used to apply transformations to values [`Right`](#right) instances of `Either`, `map` takes
a function that it will lift into the context of the `Either` and apply to
it the wrapped value. When ran on a [`Right`](#right) instance, `map` will apply the
wrapped value to the provided function and return the result in a
new [`Right`](#right) instance.

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// add :: Number -> Number -> Number
const add =
  x => y => x + y

Right(25)
  .map(add(10))
//=> Right 35

Left('Some String')
  .map(add(10))
//=> Left "Some String"

// numberOr :: a -> Either b Number
const numberOr = ifElse(
  isNumber, Right, Left
)

// add10 -> a -> Either b Number
const add10 = compose(
  map(add(10)),
  numberOr
)

add10(45)
//=> Right 55

add10('some string')
//=> Left "some string"

const processResult = compose(
  map(compose(objOf('result'), add(20))),
  numberOr
)

processResult({ a: 57 })
//=> Left { a: 57 }

processResult(57)
//=> Right{ result: 77 }
```

#### alt

```haskell
Either c a ~> Either c a -> Either c a
```

Providing a means for a fallback or alternative value, `alt` combines
two `Either` instances and will return the first [`Right`](#right) it
encounters or the last [`Left`](#left) if it does not encounter
a [`Right`](#right).

```javascript
import Either from 'crocks/Either'

const { Left, Right } = Either

Right(45)
  .alt(Right(97))
  .alt(Left(false))
//=> Right 45

Left('String')
  .alt(Left('Another String'))
  .alt(Left('Final String'))
//=> Left "Final String"

Left('error')
  .alt(Right({ passed: true }))
//=> Right { passed: true }
```

#### bimap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either d b
```

The types and values that make up an `Either` can vary independently in both
the [`Left`](#left) and [`Right`](#right) instances of the `Either`. While [`map`](#map) can be
used to apply a transformation to a [`Right`](#right) instance, `bimap` allows
transformations for either.

`bimap` takes two mapping functions as its arguments. The first function is used
to map a [`Left`](#left) instance, while the second maps a [`Right`](#right). `Either` only
provides a means to map a [`Right`](#right) instance exclusively using [`map`](#map). If
the need arises to map a [`Left`](#left) instance exclusively, then `bimap` can be used,
passing the mapping function to the first argument and
an [`identity`][identity] to the second.

```javascript
import Either from 'crocks/Either'

import bimap from 'crocks/pointfree/bimap'
import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// lte :: Number -> Number -> Boolean
const lte =
  x => y => y <= x

// gt10 :: Number -> Either Number Number
const gt10 =
  ifElse(lte(10), Left, Right)

// offsetBy :: Number -> Number -> Number
const offsetBy =
  x => y => x + y

// scaleBy :: Number -> Number -> Number
const scaleBy =
  x => y => x * y

// compute :: Number -> Either Number Number
const compute = compose(
  bimap(scaleBy(10), offsetBy(10)),
  gt10
)

compute(10)
//=> Left 100

compute(20)
//=> Right 30

// arrayOf :: a -> [ a ]
const arrayOf =
  x => [ x ]

// resultOf :: a -> { result: a }
const resultOf =
  objOf('result')

// format :: Either c a -> Either [ c ] { result: a }
const format =
  bimap(arrayOf, resultOf)

format(Left(100))
//=> Left [ 100 ]

format(Right(30))
//=> Right { result: 30 }

// processAndFormat :: Either Number Number -> Either [ Number ] { result: Number }
const processAndFormat = bimap(
  compose(arrayOf, scaleBy(10)),
  compose(resultOf, offsetBy(10))
)

// flow :: Number -> Either [ Number ]
const flow = compose(
  processAndFormat,
  gt10
)

flow(10)
//=> Left [ 100 ]

flow(20)
//=> Right { result: 30 }
```

#### ap

```haskell
Either c (a -> b) ~> Either c a -> Either c b
```

Short for apply, `ap` is used to apply an `Either` instance containing a value
to another `Either` instance that contains a function, resulting in
new `Either` instance containing the result of the application. `ap` requires
that it is called on either a [`Left`](#left) containing anything or a [`Right`](#right) that
wraps a curried polyadic function.

When either instance is a [`Left`](#left), `ap` will return a [`Left`](#left) containing the
original value. This can be used to safely combine multiple values under a
given combination function. If any of the inputs results in a [`Left`](#left) than they
will never be applied to the function and not provide exceptions or undesired
results.

```javascript
import Either from 'crocks/Either'

import assign from 'crocks/helpers/assign'
import setProp from 'crocks/helpers/setProp'
import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isObject from 'crocks/predicates/isObject'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// objectOr :: a -> Either c Object
const objectOr =
  ifElse(isObject, Right, Left)

// Error :: { error: a, passed: Boolean }
// error :: a -> Error
const error = compose(
  setProp('passed', false),
  objOf('error')
)

// setPassed :: Either c Object -> Either Error Object
const setPassed = m =>
  Either.of(setProp('passed', true))
    .ap(m)
    .bimap(error, identity)

setPassed(Right({ a: 'awesome' }))
//=> Right { a: "awesome", passed: true }

setPassed(Left({ a: 'not so much' }))
//=> Left { error: { a: "not so much" }, passed: false }

// process :: a -> Either Object Object
const process =
  compose(setPassed, objectOr)

process({ a: 'awesome' })
//=> Right { a: "awesome", passed: true }

process('I am string')
//=> Left { error: "I am string", passed: false }

// assignOr :: (Either c Object, Either c Object) -> Either c Object
const assignOr = (x, y) =>
  x.map(assign).ap(y)

assignOr(Right({ b: 'also awesome' }), Right({ a: 'awesome' }))
//=> Right { a: "awesome", b: "also awesome" }

assignOr(Right({ b: 'also awesome' }), Left('not so awesome'))
//=> Left "not so awesome"

assignOr(Left({ b: 'first' }), Left({ b: 'second' }))
//=> Left { b: "first" }
```

#### sequence

```haskell
Apply f => Either c (f a) ~> (b -> f b) -> f (Either c a)
Applicative f => Either c (f a) ~> TypeRep f -> f (Either c a)
```

When an instance of `Either` wraps an `Apply` instance, `sequence` can be used
to swap the type sequence. `sequence` requires either
an `Applicative TypeRep` or an `Apply` returning function is provided for its
argument. This will be used in the case that the `Either` instance is a [`Left`](#left).

`sequence` can be derived from [`traverse`](#traverse) by passing it
an [`identity`][identity] function.

```javascript
import Either from 'crocks/Either'

import Identity from 'crocks/Identity'

const { Left, Right } = Either

// arrayOf :: a -> [ a ]
const arrayOf =
  x => [ x ]

Right([ 1, 2, 3 ])
  .sequence(arrayOf)
//=> [ Right 1, Right 2, Right 3 ]

Left('no array here')
  .sequence(arrayOf)
//=> [ Left "no array here" ]

Right(Identity.of(42))
  .sequence(Identity)
//=> Identity (Right 42)

Left(0)
  .sequence(Identity)
//=> Identity (Left 0)
```

#### traverse

```haskell
Apply f => Either c a ~> (d -> f d), (a -> f b)) -> f Either c b
Applicative f => Either c a ~> (TypeRep f, (a -> f b)) -> f Either c b
```

Used to apply the "effect" of an `Apply` to a value inside of an `Either`,
`traverse` combines both the "effects" of the `Apply` and the `Either` by
returning a new instance of the `Apply`, wrapping the result of
the `Apply`s "effect" on the value in the supplied `Either`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the "effect"
of the target `Apply` to the value inside of the `Either`. This will be used in
the case that the `Either` instance is a [`Left`](#left). Both arguments must provide
an instance of the target `Apply`.

```javascript
import Either from 'crocks/Either'

import Pair from 'crocks/Pair'
import State from 'crocks/State'
import Sum from 'crocks/Sum'
import constant from 'crocks/combinators/constant'
import ifElse from 'crocks/logic/ifElse'
import traverse from 'crocks/pointfree/traverse'

const { Left, Right } = Either
const { get } = State

// tallyOf :: Number -> Pair Sum Number
const tallyOf =
  x => Pair(Sum.empty(), x)

// incBy :: Number -> Pair Sum Number
const incBy =
  x => Pair(Sum(x), x)

Right(12)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 12, Right 12 )

Left(true)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 0, Left true )

// lte10 :: Number -> Either Number Number
const lte10 =
  ifElse(x => x <= 10, Right, Left)

// update :: Number -> State Number Number
const update = x =>
  State.modify(state => x + state)
    .chain(constant(get()))

// updateSmall :: () => State Number Number
const updateSmall = () =>
  get(lte10)
    .chain(traverse(State, update))

updateSmall()
  .runWith(3)
//=> Pair( Right 6, 6 )

updateSmall()
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Left 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Left 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(30)
//=> Pair( Left 30, 30 )
```

#### chain

```haskell
Either c a ~> (a -> Either c b) -> Either c b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with `chain`. `chain` expects a unary, `Either` returning function
as its argument. When invoked on a [`Left`](#left), `chain` will not run the function,
but will instead return another [`Left`](#left) wrapping the original value. When called
on a [`Right`](#right) however, the inner value will be passed to the provided function,
returning the result as the new instance.

```javascript
import Either from 'crocks/Either'

import getProp from 'crocks/Maybe/getProp'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import maybeToEither from 'crocks/Either/maybeToEither'
import propEq from 'crocks/predicates/propEq'

const { Left, Right } = Either

// lift :: (b -> Boolean) -> b -> Either c a
const lift = pred =>
  ifElse(pred, Right, Left)

// isPassed :: b -> Either c Object
const isPassed =
  lift(propEq('passed', true))

isPassed({ value: 'Nope' })
// Left { value: "Nope" }

isPassed({ value: 'yes', passed: true })
// Right { value: "yes", passed: true }

// stringOr :: b -> Either c String
const stringOr =
  lift(isString)

// valueOr :: b -> Either c a
const valueOr = x =>
  maybeToEither(x, getProp('value'), x)

// getStringValue :: b -> Either c String
const getStringValue = x =>
  isPassed(x)
    .chain(valueOr)
    .chain(stringOr)

getStringValue({
  value: 'So good',
  passed: true
})
//=> Right "So Good"

getStringValue({
  value: 'Not passed'
})
//=> Left { value: "Not passed" }

getStringValue({
  value: 33,
  passed: true
})
//=> Right "So Good"

getStringValue({
  value: 33,
  passed: true
})
//=> Left 33
```

#### coalesce

```haskell
Either c a ~> ((c -> b), (a -> b)) -> Either c b
```

Used to take a [`Left`](#left) instance and not only map its internal value,
but also to "promote" it to a [`Right`](#right) instance. `coalesce` takes two
unary functions as its arguments and will return a new [`Right`](#right) instance.

The first function is used when invoked on a [`Left`](#left) and will return
a [`Right`](#right) instance, wrapping the result of the function. The second
function is used when `coalesce` is invoked on a [`Right`](#right) and is used
to map the original value, returning a new [`Right`](#right) instance wrapping
the result of the second function.

```javascript
import Either from 'crocks/Either'

import setProp from 'crocks/helpers/setProp'
import coalesce from 'crocks/pointfree/coalesce'
import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import hasProp from 'crocks/predicates/hasProp'
import ifElse from 'crocks/logic/ifElse'
import map from 'crocks/pointfree/map'
import mapProps from 'crocks/helpers/mapProps'

const { Left, Right } = Either

// inc :: Number -> Number -> Number
const inc =
  x => x + 1

Right(45)
  .coalesce(identity, inc)
//=> Right 46

Left(45)
  .coalesce(identity, inc)
//=> Right 45

// Record :: { value: Number }
// hasValue :: Object -> Either Object Record
const hasValue =
  ifElse(hasProp('value'), Right, Left)

hasValue({ a: 45 })
// Left { a: 45 }

hasValue({ value: 45 })
// Right { value: 45 }

// defaultValue :: Either Object Record -> Either Object Record
const defaultValue =
  coalesce(setProp('value', 0), identity)

// incValue :: Either Object Record -> Either c Record
const incValue = compose(
  map(mapProps({ value: inc })),
  defaultValue,
  hasValue
)

incValue({ value: 45 })

//=> Right { value: 46 }

incValue({ a: 44 })
//=> Right { a: 44, value: 1 }
```

#### bichain

```haskell
Either c a ~> ((c -> Either d b), (a -> Either d b)) -> Either d b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with [`chain`](#chain). Along the same lines, `bichain` allows you
to do this from both [`Left`](#left) and [`Right`](#right). `bichain` expects
two unary, `Either` returning functions as its arguments. When invoked on
a [`Left`](#left) instance, `bichain` will use
the left, or first, function that can return either a [`Left`](#left) or
a [`Right`](#right) instance. When called on a [`Right`](#right) instance, it
will behave exactly as [`chain`](#chain) would with the right, or
second, function.

```javascript
import Either from 'crocks/Either'

import bichain from 'crocks/pointfree/bichain'
import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'

const { Left, Right } = Either

// swapEither :: Either a b -> Either b a
const swapEither =
  bichain(Right, Left)

swapEither(Left('left'))
//=> Right "left"

swapEither(Right('right'))
//=> Left "right"

// length :: String -> Number
const length = x =>
  x.length

// add10 :: Number -> Number
const add10 = x =>
  x + 10

// safe :: (a -> Boolean) -> a -> Either c b
const safe = pred =>
  ifElse(pred, Right, Left)

// stringLength :: a -> Either e Number
const stringLength = compose(
  map(length),
  safe(isString)
)

// nested :: a -> Either c Number
const nested = compose(
  map(add10),
  bichain(stringLength, Right),
  safe(isNumber)
)

nested('cool')
//=> Right 14

nested(true)
//=> Left true

nested(13)
//=> Right 23
```

#### swap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either b d
```

Used to map the value of an `Either` instance and transform a [`Left`](#left) into a
[`Right`](#right) or a [`Right`](#right) into a [`Left`](#left), `swap` takes two functions as its arguments.
The first function is used to map and transform a [`Left`](#left) into a [`Right`](#right),
while the second maps and transforms a [`Right`](#right) into a [`Left`](#left). If no mapping of
the contained values is required for either instance,
then [`identity`][identity] functions can be used in one or both arguments.

```javascript
import Either from 'crocks/Either'

import identity from 'crocks/combinators/identity'
import swap from 'crocks/pointfree/swap'

const { Left, Right } = Either

// swapTypes :: Either c a -> Either a c
const swapTypes =
  swap(identity, identity)

swapTypes(Left(45))
//=> Right 45

swapTypes(Right(23))
//=> Left 23

// toString :: Number -> String
const toString =
  x => x.toString()

// toNumber :: String -> Number
const toNumber =
  x => parseInt(x)

// swapValues :: Either Number String -> Either Number String
const swapValues =
  swap(toString, toNumber)

swapValues(Left(23))
//=> Right "23"

swapValues(Right('23'))
//=> Left 23
```

#### either

```haskell
Either c a ~> ((c -> b), (a -> b)) -> b
```

Used as a means to map and extract a value from an `Either` based on the
context, `either` takes two functions as its arguments. The first will map any
[`Left`](#left) value in a left instance. While the second is used to map any [`Right`](#right)
instance value. The function will return the result of whichever function is
used to map.

```javascript
import Either from 'crocks/Either'

import curry from 'crocks/helpers/curry'
import either from 'crocks/pointfree/either'
import identity from 'crocks/combinators/identity'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// toObject :: String -> Either a Object -> Object
const toObject = curry(
  key => either(objOf(key), identity)
)

toObject('num', Left(44))
//=> { num: 44 }

toObject('num', Right({ string: 'a string' }))
//=> { string: 'a string' }
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### firstToEither

`crocks/Either/firstToEither`

```haskell
firstToEither :: c -> First a -> Either c a
firstToEither :: c -> (a -> First b) -> a -> Either c a
```

Used to transform a given [`First`][first] instance to an `Either` instance or
flatten an `Either` of [`First`][first] into an `Either` when chained, `firstToEither` will
turn a non-empty instance into a [`Right`](#right) wrapping the original
value contained within the [`First`][first].

The [`First`][first] datatype is based on a [`Maybe`][maybe] and as such its
is fixed to a `()` (unit) type. As a means to allow for convenient
transformation, `firstToEither` takes a default [`Left`](#left) value as the
first argument. This value will be wrapped in a
resulting [`Left`](#left) instance in the case of empty.

Like all `crocks` transformation functions, `firstToEither` has two possible
signatures and will behave differently when passed either
a [`First`][first] instance or a function that returns an instance
of [`First`][first]. When passed the instance, a transformed `Either` is
returned. When passed a [`First`][first] returning function, a function will be
returned that takes a given value and returns a `Either`.

```javascript
import Either from 'crocks/Either'

import First from 'crocks/First'
import and from 'crocks/logic/and'
import firstToEither from 'crocks/Either/firstToEither'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

const { Right } = Either

// sorry :: First a -> Either String a
const sorry =
  firstToEither('Sorry Charlie')

sorry(First.empty())
//=> Left "Sorry Charlie"

sorry(First('So Good'))
//=> Right "So Good"

// gte :: Number -> Number -> Boolean
const gte =
  y => x => x >= y

// isValid :: a -> Boolean
const isValid =
  and(isNumber, gte(30))

// firstValid :: a -> First Number
const firstValid =
  mconcatMap(First, safe(isValid))

// data :: [ * ]
const data =
  [ 1, '200', 60, 300 ]

Right(data)
  .chain(sorry(firstValid))
//=> Right 60

Right(data)
  .map(map(x => x.toString()))
  .chain(sorry(firstValid))
//=> Left "Sorry Charlie"

Right(First.empty())
  .chain(firstToEither('Port'))
//=> Left "Port"

Right(First('Ship'))
  .chain(firstToEither('Port'))
//=> Right "Ship"
```

#### lastToEither

`crocks/Either/lastToEither`

```haskell
lastToEither :: c -> Last a -> Either c a
lastToEither :: c -> (a -> Last b) -> a -> Either c a
```

Used to transform a given [`Last`][last] instance to an `Either` or flatten
an `Either` of [`Last`][last] into an `Either` when chained, `lastToEither` will
turn a non-empty [`Last`][last] instance into a [`Right`](#right) instance
wrapping the original value contained in the original non-empty.

The [`Last`][last] datatype is based on a [`Maybe`][maybe] and as such its left
or empty value is fixed to a `()` (unit) type. As a means to allow for
convenient transformation, `lastToEither` takes a default [`Left`](#left) value
as the first argument. This value will be wrapped in a
resulting [`Left`](#left) instance, in the case of empty.

Like all `crocks` transformation functions, `lastToEither` has two possible
signatures and will behave differently when passed either
a [`Last`][last] instance or a function that returns an instance
of [`Last`][last]. When passed the instance, a transformed `Either` is returned.
When passed a [`Last`][last] returning function, a function will be returned
that takes a given value and returns an `Either`.

```javascript
import Either from 'crocks/Either'

import Last from 'crocks/Last'
import and from 'crocks/logic/and'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import lastToEither from 'crocks/Either/lastToEither'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'
import when from 'crocks/logic/when'

const { Right } = Either

// sorry :: Last a -> Either String a
const sorry =
  lastToEither('Sorry Charlie')

sorry(Last.empty())
//=> Left "Sorry Charlie"

sorry(Last('So Good'))
//=> Right "So Good"

// lte :: Number -> Number -> Boolean
const lte =
  y => x => x <= y

// length :: String -> Number
const length =
  x => x.length

// isValid :: a -> Boolean
const isValid =
  and(isString, compose(lte(3), length))

// lastValid :: a -> Last Number
const lastValid =
  mconcatMap(Last, safe(isValid))

// data :: [ * ]
const data =
  [ 1, '200', 60, 300 ]

Right(data)
  .chain(sorry(lastValid))
//=> Right "200"

Right(data)
  .map(map(when(isString, concat('!'))))
  .chain(sorry(lastValid))
//=> Left "Sorry Charlie"

Right(Last.empty())
  .chain(lastToEither('Port'))
//=> Left "Port"

Right(Last('Ship'))
  .chain(lastToEither('Port'))
//=> Right "Ship"
```

#### maybeToEither

`crocks/Either/maybeToEither`

```haskell
maybeToEither :: c -> Maybe a -> Either c a
maybeToEither :: c -> (a -> Maybe b) -> a -> Either c a
```

Used to transform a given [`Maybe`][maybe] instance to an `Either` instance or
flatten an `Either` of [`Maybe`][maybe] into an `Either` when chained, `maybeToEither` will
turn a [`Just`][just] instance into a [`Right`](#right) instance wrapping
the original value contained in the original [`Just`][just].

A [`Nothing`][nothing] instance is fixed to a `()` type and as such can only
ever contain a value of `undefined`. As a means to allow for convenient
transformation, `maybeToEither` takes a default [`Left`](#left) value
as the first argument. This value will be wrapped in a
resulting [`Left`](#left) instance, in the case of [`Nothing`][nothing].

Like all `crocks` transformation functions, `maybeToEither` has two possible
signatures and will behave differently when passed either
a [`Maybe`][maybe] instance or a function that returns an instance
of [`Maybe`][maybe]. When passed the instance, a transformed `Either` is
returned. When passed a [`Maybe`][maybe] returning function, a function will be
returned that takes a given value and returns an `Either`.

```javascript
import Either from 'crocks/Either'

import Maybe from 'crocks/Maybe'
import compose from 'crocks/helpers/compose'
import fanout from 'crocks/Pair/fanout'
import identity from 'crocks/combinators/identity'
import isObject from 'crocks/predicates/isObject'
import maybeToEither from 'crocks/Either/maybeToEither'
import merge from 'crocks/pointfree/merge'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just } = Maybe
const { Right } = Either

maybeToEither(false, Nothing())
//=> Left false

maybeToEither(false, Just(true))
//=> Right true

// isValid :: a -> Either b Object
const isValid = compose(
  merge(maybeToEither),
  fanout(identity, safe(isObject))
)

Right('I am String')
  .chain(isValid)
//=> Left "I am String"

Right({ key: 'value' })
  .chain(isValid)
//=> Right { key: "value" }

Right(Nothing())
  .chain(maybeToEither('Left'))
//=> Left "Left"

Right(Just('42'))
  .chain(maybeToEither('Left'))
//=> Right "42"
```

#### resultToEither

`crocks/Either/resultToEither`

```haskell
resultToEither :: Result e a -> Either e a
resultToEither :: (a -> Result e b) -> a -> Either e a
```

Used to transform a given [`Result`][result] instance to an `Either` instance or flatten
an `Either` of [`Result`][result] into an `Either` when chained, `resultToEither` will
turn an `Ok` instance into a [`Right`](#right) instance wrapping the value
contained in the original `Ok`. If an `Err` is provided, then `resultToEither` will
return a [`Left`](#left) instance, wrapping the original `Err` value.

Like all `crocks` transformation functions, `resultToEither` has two possible
signatures and will behave differently when passed either a [`Result`][result] instance
or a function that returns an instance of [`Result`][result]. When passed the instance,
a transformed `Either` is returned. When passed a [`Result`][result] returning function,
a function will be returned that takes a given value and returns an `Either`.

```javascript
import Either from 'crocks/Either'

import Result from 'crocks/Result'
import assign from 'crocks/helpers/assign'
import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import fanout from 'crocks/Pair/fanout'
import getProp from 'crocks/Maybe/getProp'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'
import maybeToResult from 'crocks/Result/maybeToResult'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'
import resultToEither from 'crocks/Either/resultToEither'
import safeLift from 'crocks/Maybe/safeLift'

const { Right } = Either
const { Err, Ok } = Result

resultToEither(Err('no good'))
//=> Left "no good"

resultToEither(Ok('so good'))
//=> Right "so good"

// safeInc :: a -> Maybe Number
const safeInc =
  safeLift(isNumber, x => x + 1)

// incProp :: String -> a -> Maybe Number
const incProp = key =>
  composeK(safeInc, getProp(key))

// incResult :: String -> a -> Result [ String ] Object
const incResult = key => maybeToResult(
  [ `${key} is not valid` ],
  compose(map(objOf(key)), incProp(key))
)

// incThem :: a -> Result [ String ] Object
const incThem = compose(
  merge(liftA2(assign)),
  fanout(incResult('b'), incResult('a'))
)

Either.of({})
  .chain(resultToEither(incThem))
//=> Left [ "b is not valid", "a is not valid" ]

Either.of({ a: 33 })
  .chain(resultToEither(incThem))
//=> Left [ "b is not valid" ]

Either.of({ a: 99, b: '41' })
  .chain(resultToEither(incThem))
//=> Left [ "b is not valid" ]

Either.of({ a: 99, b: 41 })
  .chain(resultToEither(incThem))
//=> Right { a: 100, b: 42 }

Right(Err('Left'))
  .chain(resultToEither)
//=> Left "Left"

Right(Ok('42'))
  .chain(resultToEither)
//=> Right "42"
```

</article>

[async]: ./Async.html
[identity]: ../functions/combinators.html#identity
[first]: ../monoids/First.html
[last]: ../monoids/Last.html
[maybe]: ./Maybe.html
[nothing]: ./Maybe.html#nothing
[just]: ./Maybe.html#just
[result]: ./Result.html
