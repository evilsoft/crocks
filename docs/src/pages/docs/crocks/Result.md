---
title: "Result"
description: "Result Crock"
layout: "guide"
functions: ["trycatch", "eithertoresult", "firsttoresult", "lasttoresult", "maybetoresult"]
weight: 130
---

```haskell
Result e a = Err e | Ok a
```

Result is a Sum Type similar to that of [`Either`][either] with the added
behaviour of accumulating the [`Err`](#err) when using [`ap`](#ap) or [`alt`](#alt).
With [`Either`][either] being defined as a tagged union type, it captures the
essence of disjunction as it provides either a [`Left`][left] value or
a [`Right`][right] value but not both. With a `Result` the left contains the
error information from an operation and the right contains the result.
`Result` is well suited for capturing disjunction when the cause of the "error"
case needs to be communicated. For example, when executing a function and you
exception is important or useful.

A `Result` represents disjunction by using two constructors, [`Err`](#err) and [`Ok`](#ok).
An [`Ok`](#ok) instance represents the positive result while [`Err`](#err) is
considered the negative. With the exception
of[`coalesce`](#coalesce), [`swap`](#swap) and [`bimap`](#bimap), all `Result` returning
methods on an instance will be applied to an [`Ok`](#ok) returning the result.
If an instance is an [`Err`](#err), then all application is skipped and
another [`Err`](#err) instance is returned with the same containing value.

It is recommended to use the available [`Ok`](#ok) and [`Err`](#err) constructors
to construct `Result` instances in most cases. You can use the `Result` constructor
to construct an [`Ok`](#ok), but it will read better to just use [`Ok`](#ok).

```javascript
import Result from 'crocks/Result'

import and from 'crocks/logic/and'
import bimap from 'crocks/pointfree/bimap'
import composeB from 'crocks/combinators/composeB'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'

const { Err, Ok } = Result

// gte :: Number -> Number -> Boolean
const gte = y => x =>
  x >= y

// lte :: Number -> Number -> Boolean
const lte = y => x =>
  x <= y

// between :: (Number, Number) -> Boolean
const between = (x, y) =>
  and(gte(x), lte(y))

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// inRange :: Number -> Result
const inRange =
  ensure(between(10, 15))

inRange(12)
//=> Ok 12

inRange(25)
//=> Err 25

inRange('Test')
//=> Err "Test"

// ensureNumber :: a -> Result [a] a
const ensureNumber = composeB(
  bimap(x => [ x ], x => x),
  ensure(isNumber)
)

// prod :: Number -> Number -> Number
const prod = a => b =>
  a * b

ensureNumber('Not a number 1')
  .alt(ensureNumber('Not a number 2'))
//=> Err [ "Not a number 1", "Not a number 2" ]

liftA2(
  prod,
  ensureNumber('Not 21'),
  ensureNumber('Not 2')
)
//=> Err [ "Not 21", "Not 2" ]

liftA2(
  prod,
  ensureNumber(21),
  ensureNumber(2)
)
//=> Ok 42
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Apply`, `Traversable`,
`Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Result :: a -> Result e a
```

Most of the time, `Result` is constructed using functions of your own making
and helper functions like [`tryCatch`](#trycatch) or by employing one of the
instance constructors, [`Ok`](#ok) or [`Err`](#err). This is due to the nature
of `Result` and most other Sum Types.

As a matter of consistency and completion, a `Result` instance can also be
constructed using its TypeRep like any other type. The `Result` constructor is
a unary function that accepts any type `a` and returns a [`Ok`](#ok) instance,
wrapping the value passed to its argument.

```javascript
import Result from 'crocks/Result'

import equals from 'crocks/pointfree/equals'

const { Ok, Err, of } = Result

Result('some string')
//=> Ok "some string"

Result(null)
//=> Ok null

Result(undefined)
//=> Ok undefined

of('some string')
//=> Ok "some string"

of(null)
//=> Ok null

of(undefined)
//=> Ok undefined

Ok('some string')
//=> Ok "some string"

Ok(null)
//=> Ok null

Ok(undefined)
//=> Ok undefined

Err('some string')
//=> Err "some string"

Err(null)
//=> Err null

Err(undefined)
//=> Err undefined

equals(
  Result.Ok([ 1, 2, 3 ]),
  Result.of([ 1, 2, 3 ])
)
//=> true

equals(
  of({ a: 100 }),
  Result({ a: 100 })
)
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Err

```haskell
Result.Err :: e -> Result e a
```

Used to construct an [`Err`](#err) instance that represents the "false" portion
of a disjunction. When an instance is an [`Err`](#err), most `Result` returning
methods will just return a new [`Err`](#err) instance with the same containing
value.

The power of the [`Err`](#err) as opposed to a [`Left`][left] or a [`Nothing`][nothing] is
that it can hold meaningful information on why the flow is in this path. It will
also accumulate this information when [`ap`](#ap) or [`alt`](#alt) are used. This works as a
core tool when using Railway Orientated Programming concepts.

```javascript
import Result from 'crocks/Result'

import bimap from 'crocks/pointfree/bimap'
import chain from 'crocks/pointfree/chain'
import composeB from 'crocks/combinators/composeB'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Ok, Err } = Result

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// buildError :: () -> String
const buildError = () =>
  'The value given was not a valid number'

// add10 :: Number -> Number
const add10 =
  x => x + 10

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 = composeB(
  bimap(buildError, add10),
  ensure(isNumber)
)

Err(undefined)
//=> Err undefined

Err(null)
//=> Err null

Err(23)
  .map(add10)
//=> Err 23

Ok(23)
  .map(add10)
//=> Ok 33

chain(protectedAdd10, Err('number'))
//=> Err "number"

chain(protectedAdd10, Ok(10))
//=> Ok 20
```

#### Ok

```haskell
Result.Ok :: a -> Result e a
```

Used to construct an [`Ok`](#ok) instance that represents the "true" portion of
a disjunction or a valid value. [`Ok`](#ok) will wrap any given value in an
[`Ok`](#ok), signaling the validity of the wrapped value.

```javascript
import Result from 'crocks/Result'

import bimap from 'crocks/pointfree/bimap'
import composeB from 'crocks/combinators/composeB'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'

const { Ok, Err } = Result

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// buildError :: () -> String
const buildError = () =>
  'The value given is not a valid string'

// ensureString :: a -> Result String Number
const ensureString = composeB(
  bimap(buildError, identity),
  ensure(isString)
)

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

Ok(32)
//=> Ok 32

Ok(undefined)
//=> Ok undefined

Ok(null)
//=> Ok null

// safeShout :: a -> Result String
const safeShout = composeB(
  map(toUpper),
  ensureString
)

safeShout(45)
//=> Err "The value given is not a valid string"

safeShout('Hey there!')
//=> Ok "HEY THERE!"
```

#### of

```haskell
Result.of :: a -> Result e a
```

Used to wrap any value into a `Result` as an [`Ok`](#ok), `of` is used mostly
by helper functions that work "generically" with instances of
either `Applicative` or `Monad` types. When working specifically with
the `Result` type, the [`Ok`](#ok) constructor should be used. Reach for `of` when
working with functions that will work with ANY `Applicative`/`Monad`.

```javascript
import Result from 'crocks/Result'

const { Ok, of } = Result

of('Some result!')
//=> Ok "Some result!"

of(undefined)
//=> Ok undefined

Ok('Some result!')
//=> Ok "Some result!"

Ok(undefined)
//=> Ok undefined

Result('Some result!')
//=> Ok "Some result!"

Result(undefined)
//=> Ok undefined
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Result e a ~> b -> Boolean
```

Used to compare the contained values of two `Result` instances for equality by
value. `equals` takes any given argument and returns `true` if the passed
argument is a `Result` ([`Ok`](#ok) or [`Err`](#err)) with a contained value
equal to the contained value of the `Result` the method is being called on. If
the passed argument is not a `Result` or the contained values are not equal by
value then `equals` will return `false`.

```javascript
import Result from 'crocks/Result'

import equals from 'crocks/pointfree/equals'

const { Ok, Err } = Result

Ok('result')
  .equals(Ok('result'))
//=> true

Ok(null)
  .equals(Ok(null))
//=> true

Ok('error')
  .equals(Err('error'))
//=> false

// by value, not reference for most types
Ok([ 1, { a: 2 }, 'string' ])
  .equals(Ok([ 1, { a: 2 }, 'string' ]))
//=> true

equals(Ok('result'), 'result')
//=> false
```

#### concat

```haskell
Semigroup s => Result e s ~> Result e s -> Result e s
```

When an underlying value of a given `Result` is fixed to a `Semigroup`, `concat` can
be used to concat another `Result` instance with an underlying `Semigroup` of
the same type. Expecting a `Result` wrapping a `Semigroup` of the same
type, `concat` will give back a new `Result` instance wrapping the result of
combining the two underlying `Semigroup`s. When called on
a [`Err`](#err) instance, `concat` will return an [`Err`](#err) with the value
of the first [`Err`](#err) in the chain.

```javascript
import Result from 'crocks/Result'

import concat from 'crocks/pointfree/concat'

const { Ok, Err } = Result

Ok([ 1, 2, 3 ])
  .concat(Ok([ 4, 5, 6 ]))
//=> [ 1, 2, 3, 4, 5, 6 ]

Ok([ 1, 2, 3 ])
  .concat(Err([ 4, 5, 6 ]))
//=> Err [ 4, 5, 6 ]

concat(Ok('Result'), Err('Error'))
//=> Err "Error"

concat(Err('Error'), Ok('Result'))
//=> Err "Error"

concat(Err('Error 1'), Err('Error 2'))
//=> Err "Error 2"
```

#### map

```haskell
Result e a ~> (a -> b) -> Result e b
```

Used to apply transformations to values in the safety of a `Result`, `map` takes
a function that it will lift into the context of the `Result` and apply to it
the wrapped value. When run on an [`Ok`](#ok) instance, `map` will apply the
wrapped value to the provided function and return the result in a new [`Ok`](#ok)
instance. When run on an ['Err'](#err) `map` with return the error value in a new
[`Err`](#err) instance.

```javascript
import Result from 'crocks/Result'

import assign from 'crocks/helpers/assign'
import compose from 'crocks/helpers/compose'
import composeB from 'crocks/combinators/composeB'
import fanout from 'crocks/Pair/fanout'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'

const { Ok, Err } = Result

// buildError :: () -> Result String a
const buildError = () =>
  Err('The value given was not a valid number')

// double :: Number -> Number
const double =
  x => x * 2

// fromNumber :: a -> Result String Number
const fromNumber =
  ifElse(isNumber, Ok, buildError)

// doubleNumber :: a -> Result String Number
const doubleNumber = composeB(
  map(double),
  fromNumber
)

doubleNumber(21)
//=> Ok 42

doubleNumber('down')
//=> Err "The value given was not a valid number"

// isEvenOrOdd :: Number -> String
const isEvenOrOdd = n =>
  n % 2 === 0 ? 'Even' : 'Odd'

// getParity :: Number -> Object
const getParity = composeB(
  objOf('parity'),
  isEvenOrOdd
)

// getInfo :: a -> Result String ({ parity: String, value: Number })
const getInfo = compose(
  map(merge(assign)),
  map(fanout(objOf('value'), getParity)),
  fromNumber
)

getInfo(5324)
//=> Ok { parity: "Even", value: 5324 }

getInfo('down')
//=> Err "The value given was not a valid number"
```

#### alt

```haskell
Result e a ~> Result e a -> Result e a
```

Providing a means for a fallback or alternative value, `alt` combines
two `Result` instances and will return the first [`Ok`](#ok) it encounters or
am [`Err`](#err) if neither value is an [`Ok`](#ok).

If the value in both [`Err`](#err) are `Semigroup`s of the same type then they
will accumulate based on their rules.

```javascript
import Result from 'crocks/Result'

import alt from 'crocks/pointfree/alt'
import compose from 'crocks/helpers/compose'
import curry from 'crocks/core/curry'
import flip from 'crocks/combinators/flip'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import map from 'crocks/pointfree/map'
import reduce from 'crocks/pointfree/reduce'
import bimap from 'crocks/pointfree/bimap'

const { Ok, Err } = Result

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// gte :: Number -> Number -> Boolean
const gte = x => y =>
  y >= x

// find :: (a -> Boolean) -> Foldable a -> Result String a
const find = curry(
  pred => compose(
    bimap(() => 'Not Found', identity),
    reduce(flip(alt), Err()),
    map(ensure(pred))
  )
)

Err('Error')
  .alt(Ok('Result'))
//=> Ok "Result"

Ok('Result')
  .alt(Err('Error'))
//=> Ok "Result"

Err('Error 1.')
  .alt(Err('Error 2.'))
//=> Err "Error 1.Error 2."

find(gte(41), [ 17, 25, 38, 42 ])
//=> Ok 42

find(gte(11), [ 1, 2, 3, 4 ])
//=> Err "Not found"
```

#### bimap

```haskell
Result e a ~> ((e -> d), (a -> b)) -> Result d b
```

While it's more common to only [`map`](#map) over a `Result` that's an
[`Ok`](#ok) there may come a time when you need to map over a `Result` regardless
of whether it's an [`Ok`](#ok) or an [`Err`](#err).

`bimap` takes two mapping functions as its arguments. The first function is
used to map an [`Err`](#err) instance, while the second maps an [`Ok`](#ok).
`Result` only provides a means to map an [`Ok`](#ok) instance exclusively using
[`map`](#map). If the need arises to map an [`Err`](#err) instance exclusively,
then `bimap` can be used, passing the mapping function to the first argument
and [`identity`][identity] to the second.

```javascript
import Result from 'crocks/Result'

import bimap from 'crocks/pointfree/bimap'
import composeB from 'crocks/combinators/composeB'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import objOf from 'crocks/helpers/objOf'
import setProp from 'crocks/helpers/setProp'

const { Ok, Err } = Result

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// buildError :: () -> String
const buildError = () =>
  'The value given was not a valid number'

// prod :: Number -> Number -> Number
const prod = x => y =>
  x * y

// fromNumber :: a -> Result String Number
const fromNumber = composeB(
  bimap(buildError, identity),
  ensure(isNumber)
)

// hasError :: Boolean -> Object -> Object
const hasError =
  setProp('hasError')

// Outcome :: { result: Number, hasError: Boolean, error: String }

// buildResult :: (String, Boolean) -> a -> Outcome
const buildResult = (key, isError) =>
  composeB(hasError(isError), objOf(key))

// finalize :: Result e a -> Result Outcome
const finalize = bimap(
  buildResult('error', true),
  buildResult('result', false)
)

// double :: a -> Result String Number
const double = composeB(
  map(prod(2)),
  fromNumber
)

finalize(double(21))
//=> Ok { hasError: false, result: 42 }

finalize(double('unk'))
//=> Err { hasError: true, error: "The value given was not a valid number" }
```

#### ap

```haskell
Result e (a -> b) ~> Result e a -> Result e b
```

Short for apply, `ap` is used to apply a `Result` instance containing a value to
another `Result` instance that contains a function, resulting in
new `Result` instance with the result. `ap` requires that it is called on
an `instance` that is either an [`Err`](#err) or an [`Ok`](#ok) that wraps a
curried polyadic function.

When either instance is an [`Err`](#err), `ap` will return an [`Err`](#err).
This can be used to safely combine multiple values under a given combination
function. If any of the inputs results in an [`Err`](#err) than they will never
be applied to the function and not provide exceptions or unexpected results.
However if the value in both [`Err`](#err) are `Semigroup`s of the same type
then they will accumulate based on their rules.

```javascript
import Result from 'crocks/Result'

import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'

const { Ok, Err } = Result

// buildError :: () -> Result String a
const buildError = () =>
  Err('The value given was not a valid number')

// prod :: Number -> Number -> Number
const prod = x => y =>
  x * y

// fromNumber :: a -> Result String Number
const fromNumber =
  ifElse(isNumber, Ok, buildError)

map(prod, fromNumber(2))
  .ap(fromNumber(5))
//=> Ok 10

map(prod, fromNumber('string'))
  .ap(fromNumber(5))
//=> Err "The value given was not a valid number"

Ok(prod)
  .ap(fromNumber(2))
  .ap(fromNumber(21))
//=> Ok 42

Ok(prod)
  .ap(fromNumber('string'))
  .ap(fromNumber(21))
//=> Err "The value given was not a valid number"

liftA2(prod, fromNumber(2), fromNumber(21))
//=> Ok 42

liftA2(prod, Err('Not 2'), Err('Not 21'))
//=> Err "Not 2Not 21"

liftA2(prod, Err([ 'Not 2' ]), Err([ 'Not 21' ]))
//=> Err [ "Not 2", "Not 21" ]
```

#### sequence

```haskell
Apply f => Result e (f a) ~> (b -> f b) -> f (Result e a)
Applicative f => Result e (f a) ~> TypeRep f -> f (Result e a)
```

When an instance of `Result` wraps an `Apply` instance, `sequence` can be used to
swap the type sequence. `sequence` requires either an `Applicative TypeRep` or
an `Apply` returning function is provided for its argument. This will be used in
the case that the `Result` instance is a [`Err`](#err).

`sequence` can be derived from [`traverse`](#traverse) by passing it
an `identity` function (`x => x`).

```javascript
import Result from 'crocks/Result'

import Identity from 'crocks/Identity'

const { Err, Ok } = Result

// arrayOf :: a -> [ a ]
const arrayOf =
  x => [ x ]

Ok([ 1, 2, 3 ])
  .sequence(arrayOf)
//=> [ Ok 1, Ok 2, Ok 3 ]

Err('no array here')
  .sequence(arrayOf)
//=> [ Err "no array here" ]

Ok(Identity.of(42))
  .sequence(Identity)
//=> Identity (Ok 42)

Err(0)
  .sequence(Identity)
//=> Identity (Err 0)
```

#### traverse

```haskell
Apply f => Result e a ~> (c -> f c), (a -> f b)) -> f Result e b
Applicative f => Result e a ~> (TypeRep f, (a -> f b)) -> f Result e b
```

Used to apply the "effect" of an `Apply` to a value inside of a `Result`,
`traverse` combines both the "effects" of the `Apply` and the `Result` by
returning a new instance of the `Apply`, wrapping the result of
the `Apply`s "effect" on the value in the `Result`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the
"effect" of the target  `Apply` to the value inside of the `Result`. This will
be used in the case that the `Result` instance is a [`Err`](#err). Both
arguments must provide an instance of the target `Apply`.

```javascript
import Result from 'crocks/Result'

import Pair from 'crocks/Pair'
import State from 'crocks/State'
import Sum from 'crocks/Sum'
import constant from 'crocks/combinators/constant'
import ifElse from 'crocks/logic/ifElse'
import traverse from 'crocks/pointfree/traverse'

const { Err, Ok } = Result
const { get, modify } = State

// lte :: Number -> Number -> Boolean
const lte = y => x =>
  x <= y

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// tallyOf :: Number -> Pair Sum Number
const tallyOf = x =>
  Pair(Sum.empty(), x)

// incBy :: Number -> Pair Sum Number
const incBy = x =>
  Pair(Sum(x), x)

Ok(12)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 12, Ok 12 )

Err(true)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 0, Err true )

// lte10 :: Number -> Result Number
const lte10 =
  ensure(lte(10))

// update :: Number -> State Number
const update = x =>
  modify(state => x + state)
    .chain(constant(get()))

// updateSmall :: () => State Number
const updateSmall = () =>
  get(lte10)
    .chain(traverse(State, update))

updateSmall()
  .runWith(3)
//=> Pair( Ok 6, 6 )

updateSmall()
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Ok 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Err 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(30)
//=> Pair( Err 30, 30 )
```

#### chain

```haskell
Result e a ~> (a -> Result e b) -> Result e b
```

Combining a sequential series of transformations that capture disjunction can
be accomplished with `chain`. `chain` expects a unary, `Result` returning
function as its argument. When invoked on an [`Err`](#err), `chain` will not run
the function, but will instead return a new [`Err`](#err) instance with the
same containing value. When called on an [`Ok`](#ok) however, the inner value
will be passed to provided function, returning the result as the new instance.

```javascript
import Result from 'crocks/Result'

import chain from 'crocks/pointfree/chain'
import composeB from 'crocks/combinators/composeB'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import maybeToResult from 'crocks/Result/maybeToResult'
import map from 'crocks/pointfree/map'
import getProp from 'crocks/Maybe/getProp'

const { Err, Ok } = Result

// errText :: (String | Number) -> String
const errText = name =>
  `${name} does not exist on the value given`

// buildError :: () -> Result String a
const buildError = () =>
  Err('the value given is not valid')

// ensure :: (a -> Boolean) -> a -> Result String a
const ensure = pred =>
  ifElse(pred, Ok, buildError)

// fromNumber :: a -> Result String Number
const fromNumber =
  ensure(isNumber)

// prop :: (String | Number) -> Object -> Result String a
const prop = name =>
  maybeToResult(errText(name), getProp(name))

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 = composeB(
  map(x => x + 10),
  fromNumber
)

// getAge :: Object -> Result String Number
const getAge = composeB(
  chain(fromNumber),
  prop('age')
)

getAge({ name: 'Sarah', age: 21 })
//=> Ok 21

getAge({ name: 'Sarah', age: 'unk' })
//=> Err "the value given is not valid"

getAge({ name: 'Sarah' })
//=> Err "age does not exist on the value given"

getAge({ name: 'Sarah', age: 21 })
  .chain(protectedAdd10)
//=> Ok 31

getAge({ name: 'Sarah', age: 'unk' })
  .chain(protectedAdd10)
//=> Err "the value given is not valid"
```

#### coalesce

```haskell
Result e a ~> ((e -> b), (a -> b))) -> Result c b
```

There will come a time in your flow that you will want to ensure you have
an [`Ok`](#ok) of a given type. `coalesce` allows you to `map` over both
the [`Ok`](#ok) and the [`Err`](#err) and return an [`Ok`](#ok). `coalesce` expects
two functions for it's inputs.

The first function is used when invoked on a [`Err`](#err) and will return
a [`Ok`](#ok) instance wrapping the result of the function. The second function
is used when `coalesce` is invoked on a [`Ok`](#ok) and is used to map the
original value, returning a new [`Ok`](#ok) instance wrapping the result of the
second function.

```javascript
import Result from 'crocks/Result'

import assign from 'crocks/helpers/assign'
import chain from 'crocks/pointfree/chain'
import coalesce from 'crocks/pointfree/coalesce'
import compose from 'crocks/helpers/compose'
import composeB from 'crocks/combinators/composeB'
import constant from 'crocks/combinators/constant'
import fanout from 'crocks/Pair/fanout'
import hasProp from 'crocks/predicates/hasProp'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import isObject from 'crocks/predicates/isObject'
import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'
import setProp from 'crocks/helpers/setProp'

const { Err, Ok } = Result

// gte :: Number -> Number -> Boolean
const gte = y => x =>
  x >= y

// ensure :: (a -> Boolean) -> a -> Result a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// fromNumber :: a -> Result a Number
const fromNumber =
  ensure(isNumber)

// ensureIsObject :: a -> Result a Object
const ensureIsObject =
  ensure(isObject)

fromNumber(45)
  .coalesce(constant(42), identity)
//=> Ok 45

fromNumber('number')
  .coalesce(constant(42), identity)
//=> Ok 42

// hasAge :: a -> Result a Boolean
const hasAge =
  ensure(hasProp('age'))

// prop :: String -> Object -> a
const prop = name => x =>
  x[name]

// Person :: { canDrink: Boolean, name: String: age: Number }

// ensureHasAge :: a -> Result a Person
const ensureHasAge = compose(
  coalesce(setProp('age', 0), identity),
  chain(hasAge),
  coalesce(constant({}), identity),
  ensureIsObject
)

// determineCanDrink :: Number -> { canDrink: Boolean }
const determineCanDrink =
  composeB(objOf('canDrink'), gte(18))

// setCanDrink :: a -> Result a Person
const setCanDrink = compose(
  merge(assign),
  map(determineCanDrink),
  fanout(identity, prop('age'))
)

// setCanDrink :: a -> Result Person
const getDetails = composeB(
  map(setCanDrink),
  ensureHasAge
)

getDetails({ name: 'John', age: 17 })
//=> Ok { canDrink: false, name: "John", age: 17 }

getDetails({ name: 'Laury', age: 22 })
//=> Ok { canDrink: true, name: "Laury", age: 22 }

getDetails(null)
//=> Ok { canDrink: false, age: 0 }

getDetails(undefined)
//=> Ok { canDrink: false, age: 0 }

getDetails(1)
//=> Ok { canDrink: false, age: 0 }

getDetails(false)
//=> Ok { canDrink: false, age: 0 }
```

#### bichain

```haskell
Result c a ~> ((c -> Result d b), (a -> Result d b)) -> Result d b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with [`chain`](#chain). Along the same lines, `bichain` allows you
to do this from both [`Err`](#err) and [`Ok`](#ok). `bichain` expects
two unary, `Either` returning functions as its arguments. When invoked on
an [`Err`](#err) instance, `bichain` will use
the left, or first, function that can return either an [`Err`](#err) or
an [`Ok`](#ok) instance. When called on an [`Ok`](#ok) instance, it
will behave exactly as [`chain`](#chain) would with the right, or
second, function.

```javascript
```

#### swap

```haskell
Result e a ~> ((e -> a), (a -> e)) -> Result e a
```

Used to map the value of a `Result` instance and transform an [`Err`](#err) into an
[`Ok`](#ok) or an [`Ok`](#ok) into an [`Err`](#err), `swap` takes two functions as its arguments.
The first function is used to map and transform an [`Err`](#err) into an [`Ok`](#ok),
while the second maps and transforms an [`Ok`](#ok) into an [`Err`](#err). If no mapping of
the contained values is required for either instance,
then [`identity`][identity] functions can be used in one or both arguments.

```javascript
import Result from 'crocks/Result'

import constant from 'crocks/combinators/constant'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import when from 'crocks/logic/when'
import swap from 'crocks/pointfree/swap'

const { Ok, Err } = Result

// simpleSwap :: Result e a -> Result a e
const simpleSwap =
  swap(identity, identity)

simpleSwap(Ok(42))
//=> Err 42

simpleSwap(Err(21))
//=> Ok 21

// ensure :: (a -> Boolean) -> a -> Result String a
const ensure = pred =>
  ifElse(pred, Ok, Err)

// fromNumber :: a -> Result String Number
const fromNumber =
  ensure(isNumber)

// toString :: Number -> String
const toString = x =>
  x.toString()

// toNumber :: String -> Number
const toNumber = x =>
  parseInt(x)

// parseWithDefault :: Number -> a -> Number
const parseWithDefault = defaultValue => value =>
  when(isNaN, constant(defaultValue), toNumber(value))

// swapWith :: Result String Number -> Result String Number
const swapValues =
  swap(parseWithDefault(0), toString)

swapValues(fromNumber(4))
//=> Err "4"

swapValues(fromNumber('number'))
//=> Ok 0
```

#### either

```haskell
Result e a ~> ((e -> b), (a -> b)) -> b
```

Used to provide a means to map a given `Result` instance folding it out of its
container. `either` expects two functions as its arguments. The first is a
function that will be used to map an [`Err`](#err). While the second
will map the value wrapped in a given [`Ok`](#ok) and return the result of that
mapping.

By composing `either` you can create functions that us the power of `ADT`s while
returning a plain javascript type.

```javascript
import Result from 'crocks/Result'

import compose from 'crocks/helpers/compose'
import either from 'crocks/pointfree/either'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import objOf from 'crocks/helpers/objOf'
import setProp from 'crocks/helpers/setProp'

const { Ok, Err } = Result

// buildError :: () -> Result String a
const buildError = () =>
  Err('The value given was not a valid number')

// ensure :: (a -> Boolean) -> a -> Result String a
const ensure = pred =>
  ifElse(pred, Ok, buildError)

// fromNumber :: a -> Result String Number
const fromNumber =
  ensure(isNumber)

// double :: Number -> Number
const double = x =>
  x * 2

// hasError :: Boolean -> Object -> Object
const hasError =
  setProp('hasError')

// buildResult :: (String, Boolean) -> a -> Object
const buildResult = (key, isError) =>
  compose(hasError(isError), objOf(key))

// ResultDetail :: { result: Number, hasError: Boolean, error: String }

// createResult :: Result e a -> ResultDetail
const createResult = either(
  buildResult('error', true),
  buildResult('result', false)
)

// doubleNumber :: a -> ResultDetail
const doubleNumber = compose(
  createResult,
  map(double),
  fromNumber
)

doubleNumber(42)
//=> { result: 84, hasError: false }

doubleNumber('value')
//=> { error: 'The value given was not a valid number', hasError: true }
```

</article>

<article id="topic-helpers">

## Helper Functions


#### tryCatch

`crocks/Result/tryCatch`

```haskell
tryCatch :: (* -> a) -> * -> Result e a
```
Used when you want to take any variadic function and wrap it with the added
function of a `Result` type. `tryCatch` will execute the function with the
parameters passed and return either an [`Ok`](#ok) when successful or an
[`Err`](#err) when an exception is thrown.

Although we do our best to not use `Error` to control program flow, there are
times when we don't have full control over the behaviour of a function. The
saviour in this situation is `tryCatch`. You can wrap this function and it
will always return a `Result`

```javascript
import tryCatch from 'crocks/Result/tryCatch'

tryCatch(() => {
  throw new Error('Simple error!')
})()
// Err "Simple error!"

// calculateArea :: (a, b) -> Number
const calculateArea = (width, height) => {
  if (isNaN(width) || isNaN(height)) {
    throw Error('Parameter is not a number!')
  }

  return width * height
}

// tryCalculateArea :: (a, b) -> Result String Number
const tryCalculateArea =
  tryCatch(calculateArea)

tryCalculateArea(3, 6)
//=> Ok 18

tryCalculateArea('String', 5)
// Err "Error: Parameter is not a number!"

// getLength :: a -> Number
const getLength = a =>
  a.length

// tryGetLength :: a -> Result String Number
const tryGetLength =
  tryCatch(getLength)

tryGetLength([ 3, 2, 1 ])
//=> Ok 3

tryGetLength()
//=> Err "TypeError: Cannot read property 'length' of undefined"
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### eitherToResult

`crocks/Result/eitherToResult`

```haskell
eitherToResult :: Either b a -> Result b a
eitherToResult :: (a -> Either c b) -> a -> Result c b
```

Used to transform a given [`Either`][either] instance to a `Result` instance
or flatten a `Result` of `Either` into a `Result` when chained, `eitherToMaybe` will
turn a [`Right`][right] instance into an [`Ok`](#ok) wrapping the original value
contained in the [`Right`][right].
All [`Left`][left] instances will map to an [`Err`](#err), mapping the
originally contained value to a `Unit`. Values on the [`Left`][left] will be
lost and as such this transformation is considered lossy in that regard.

Like all `crocks` transformation functions, `eitherToMaybe` has two possible
signatures and will behave differently when passed either
an [`Either`][either] instance or a function that returns an instance
of [`Either`][either]. When passed the instance, a transformed `Result` is
returned. When passed an [`Either`][either] returning function, a function will
be returned that takes a given value and returns a `Result`.

```javascript
import Result from 'crocks/Result'

import Either from 'crocks/Either'
import assign from 'crocks/helpers/assign'
import composeK from 'crocks/helpers/composeK'
import composeB from 'crocks/combinators/composeB'
import eitherToResult from 'crocks/Result/eitherToResult'
import fanout from 'crocks/Pair/fanout'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'
import maybeToEither from 'crocks/Either/maybeToEither'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'
import getProp from 'crocks/Maybe/getProp'
import safeLift from 'crocks/Maybe/safeLift'

const { Left, Right } = Either
const { Ok } = Result

eitherToResult(Left('no good'))
//=> Err "no good"

eitherToResult(Right('so good'))
//=> Ok "so good"

// safeInc :: a -> Maybe Number
const safeInc =
  safeLift(isNumber, x => x + 1)

// incProp :: String -> a -> Maybe Number
const incProp = key =>
  composeK(safeInc, getProp(key))

// incResult :: String -> a -> Either [ String ] Object
const incResult = key => maybeToEither(
  [ `${key} is not valid` ],
  composeB(
    map(objOf(key)),
    incProp(key)
  )
)

// incThem :: a -> Either [ String ] Object
const incThem = composeB(
  merge(liftA2(assign)),
  fanout(incResult('b'), incResult('a'))
)

Result.of({})
  .chain(eitherToResult(incThem))
//=> Err [ "b is not valid" ]

Result.of({ a: 33 })
  .chain(eitherToResult(incThem))
//=> Err [ "b is not valid" ]

Result.of({ a: 99, b: '41' })
  .chain(eitherToResult(incThem))
//=> Err [ "b is not valid" ]

Result.of({ a: 99, b: 41 })
  .chain(eitherToResult(incThem))
//=> Ok { a: 100, b: 42 }

Ok(Left('Err'))
  .chain(eitherToResult)
//=> Err "Err"

Ok(Right('42'))
  .chain(eitherToResult)
//=> Ok "42"
```

#### firstToResult

`crocks/Result/firstToResult`

```haskell
firstToResult :: e -> First a -> Result e a
firstToResult :: e -> (a -> First b) -> a -> Result e b
```

Used to transform a given [`First`][first] instance to a `Result` instance
or flatten a `Result` of [`First`][first] into a `Result` when
chained, `firstToResult` will turn a non-empty instance into an [`Ok`](#ok) wrapping
the original value contained within the [`First`][first]. All empty instances
will map to an [`Err`](#err) with the given value.

Like all `crocks` transformation functions, `firstToResult` has two possible
signatures and will behave differently when passed either
a [`First`][first] instance or a function that returns an instance
of [`First`][first]. When passed the instance, a transformed `Result` is
returned. When passed a [`First`][first] returning function, a function will be
returned that takes a given value and returns a `Result`.

```javascript
import First from 'crocks/First'

import composeB from 'crocks/combinators/composeB'
import concat from 'crocks/pointfree/concat'
import firstToResult from 'crocks/Result/firstToResult'
import flip from 'crocks/combinators/flip'
import mapReduce from 'crocks/helpers/mapReduce'
import getProp from 'crocks/Maybe/getProp'

const { empty } = First

// Person :: { name: String, age: Number }

// createPerson :: (String, Number) -> Person
const createPerson = (name, age) => ({
  name, age
})

// liftName :: Person -> First String
const liftName = composeB(
  First,
  getProp('name')
)

// mergeFirstName :: [ Person ] -> First String
const mergeFirstName = composeB(
  firstToResult('(No name found)'),
  mapReduce(liftName, flip(concat), empty())
)

mergeFirstName([
  createPerson('John', 30),
  createPerson('Jon', 33)
])
//=> Ok "John"

mergeFirstName([
  createPerson(undefined, 30),
  createPerson(undefined, 33)
])
//=> Err "(No name found)"
```

#### lastToResult

`crocks/Result/lastToResult`

```haskell
lastToResult :: e -> Last a -> Result e a
lastToResult :: e -> (a -> Last b) -> a -> Result e b
```

Used to transform a given [`Last`][last] instance to a `Result` instance or
flatten a `Result` of [`Last`][last] into a `Result` when chained, `lastToResult` will
turn a non-empty instance into a [`Ok`](#ok) wrapping the original value
contained within the [`Last`][last]. All empty instances will map to a
[`Err`](#err).

Like all `crocks` transformation functions, `lastToResult` has two possible
signatures and will behave differently when passed either
a [`Last`][last] instance or a function that returns an instance
of [`Last`][last]. When passed the instance, a transformed `Result` is returned.
When passed a [`Last`][last] returning function, a function will be returned
that takes a given value and returns a `Result`.

```javascript
import Result from 'crocks/Result'

import Last from 'crocks/Last'
import lastToResult from 'crocks/Result/lastToResult'

import mconcat from 'crocks/helpers/mconcat'

const { Ok, Err } = Result

// lastValue :: [ a ] -> Last a
const lastValue =
  mconcat(Last)

lastToResult('Error occurred!', Last('the end'))
//=> Ok "the end"

Err('Error occurred!')
  .chain(lastToResult('Error occurred!', lastValue))
//=> Err "Error occurred!"

Ok([])
  .chain(lastToResult('Error occurred!', lastValue))
//=> Err "Error occurred!"

Ok([ 'first', 'second', 'third' ])
  .chain(lastToResult('Error occurred!', lastValue))
//=> Ok "third"

Ok(Last('last'))
  .chain(lastToResult('Error occurred!'))
//=> Ok "last"
```

#### maybeToResult

`crocks/Result/maybeToResult`

```haskell
maybeToResult :: e -> Maybe a -> Result e a
maybeToResult :: e -> (a -> Maybe b) -> a -> Result e b
```

Used to transform a given [`Maybe`][maybe] instance to a `Result` instance
or flatten a `Result` of [`Maybe`][maybe] into a `Result` when
chained, `maybeToResult` will turn a [`Just`][just] instance into
an [`Ok`](#ok) wrapping the original value contained in the [`Just`][just].
All [`Nothing`](nothing) instances will map to a [`Err`](#err), containing the
given `e` value.

Like all `crocks` transformation functions, `maybeToResult` has two possible
signatures and will behave differently when passed either a [`Maybe`][maybe] instance
or a function that returns an instance of [`Maybe`][maybe]. When passed the instance,
a transformed `Result` is returned. When passed a [`Maybe`][maybe] returning function,
a function will be returned that takes a given value and returns a `Result`.
This means that when used with the [`Maybe-helpers`][helpers] and `compose` you
have a larger collection of `Result` returning functions.

```javascript
import Result from 'crocks/Result'

import composeB from 'crocks/combinators/composeB'
import maybeToResult from 'crocks/Result/maybeToResult'
import Maybe from 'crocks/Maybe'
import getProp from 'crocks/Maybe/getProp'

const { Ok } = Result
const { Just, Nothing } = Maybe

maybeToResult('An error occurred', Just('21'))
//=> Ok "21"

maybeToResult('An error occurred', Nothing())
//=> Err "An error occurred"

// Person :: { name: string, age: Number }

// getName :: Person -> Result String
const getName = composeB(
  maybeToResult('Name did not exist or was undefined'),
  getProp('name')
)

getName({ name: 'John', age: 21 })
//=> Ok "John"

getName({ age: 27 })
//=> Err "Name did not exist or was undefined"

Ok(Just('in time!'))
  .chain(maybeToResult('An error occurred'))
//=> Ok "in time!"

Ok(Nothing())
  .chain(maybeToResult('An error occurred'))
//=> Err "An error occurred"
```
</article>

[pred]: ./Pred.html
[either]: ./Either.html
[left]: ./Either.html#left
[right]: ./Either.html#right
[first]: ../monoids/First.html
[last]: ../monoids/Last.html
[maybe]: ../monoids/Maybe.html
[just]: ./Maybe.html#just
[nothing]: ./Maybe.html#nothing
[helpers]: ./Maybe.html#helper-functions
[identity]: ../functions/combinators.html#identity
