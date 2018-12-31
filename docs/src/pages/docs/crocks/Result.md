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

Result is a Sum Type a step above [`Maybe`][maybe]. With a [`Maybe`][maybe] the left side
contains no information, where as with a `Result` the left contains the
error information from an operation. `Result` is well suited for capturing 
disjunction when the cause of the "error" case needs to be communicated. For
example, when executing a function and you exception is important or useful.

A `Result` represents disjunction by using two constructors, [`Err`](#err) or
[`Ok`](#ok). An [`Ok`](#ok) instance represents the positive result while
[`Err`](#err) is considered the negative. With the exception of
[`coalesce`](#coalesce), [`swap`](#swap) and [`bimap`](#bimap), all `Result`
returning methods on an instance will be applied to a [`Ok`](#ok) returning the
result. If an instance is a [`Err`](#err), then all application is skipped and
another [`Err`](#err) is returned.

It is recommended to use the available [`Ok`](#ok) and [`Err`](#err)
constructors to construct `Result` instances in most cases. You can use the
`Result` constructor to construct a [`Ok`](#ok), but it will read better to 
just use [`Ok`](#ok).

```javascript
import Result from 'crocks/Result'

import and from 'crocks/logic/and'
import ifElse from 'crocks/logic/ifElse'
import curry from 'crocks/core/curry'
import tryCatch from 'crocks/Result/tryCatch'
import compose from 'crocks/core/compose'
import chain from 'crocks/pointfree/chain'
import isDefined from 'crocks/predicates/isDefined'
import constant from 'crocks/combinators/constant'
import bimap from 'crocks/pointfree/bimap'
import identity from 'crocks/combinators/identity'

const { Err, Ok } = Result

// gte :: Number -> Number -> Boolean
const gte =
  y => x => x >= y

// lte :: Number -> Number -> Boolean
const lte =
  y => x => x <= y

// between :: (Number, Number) -> Boolean
const between = (x, y) => and(gte(x), lte(y))

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, Err)

// inRange :: Number -> Result
const inRange = ensure(between(10, 15))

inRange(12)
//=> Ok 12

inRange(25)
//=> Err 25

inRange('Test')
//=> Err "Test"

const prop =
  curry((name, obj) => obj[name])

const tryGetAge = compose(
  bimap(constant('Age not found!'), identity),
  chain(ensure(isDefined)),
  tryCatch(prop('age'))
)

tryGetAge({ name: 'Sarah', age: 23 })
//=> Ok 23

tryGetAge({ name: 'Sarah' })
//=> Err "Age not found!"

tryGetAge(1)
//=> Err "Age not found!"

tryGetAge(undefined)
//=> Err "Age not found!"
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

Used to construct an [`Err`](#err) instance that represents the "false" or
"Negative" portion of a disjunction. When an instance is an [`Err`](#err), most
`Result` returning methods will just return another [`Err`](#err).

The power of the [`Err`](#err) as opposed to a [`Nothing`] is that it can hold
meaningful information on why the flow is in this path. This works as a core
tool when using Railway Orientated Programming concepts.

```javascript
import Result from 'crocks/Result'

import chain from 'crocks/pointfree/chain'
import bimap from 'crocks/pointfree/bimap'
import isNumber from 'crocks/predicates/isNumber'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'

const { Ok, Err } = Result

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, Err)

// buildError :: String -> String
const buildError = x => `${x} is not a valid number`

// add10 :: Number -> Number
const add10 =
  x => x + 10

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 = compose(
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

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import bimap from 'crocks/pointfree/bimap'
import identity from 'crocks/combinators/identity'

const { Ok, Err } = Result

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, Err)

// buildError :: String -> String
const buildError = x => `${x} is not a valid string`

// protectedAdd10 :: a -> Result String Number
const ensureString = compose(
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

// safeShout :: a -> Result String String
const safeShout = compose(
  map(toUpper),
  ensureString
)

safeShout(45)
//=> Err "45 is not a valid string"

safeShout('Hey there!')
//=> Ok "HEY THERE!"
```

#### of

```haskell
Result.of :: a -> Result e a
```

Used to wrap any value into a `Result` as an [`Ok`](#ok), `of` is used mostly 
by helper functions that work "generically" with instances of either 
`Applicative` or `Monad`. When working specifically with the `Result` type, the
[`Ok`](#ok) constructor should be used. Reach for `of` when working with 
functions that will work with ANY `Applicative`/`Monad`.

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
arguments is a `Result` ([`Ok`](#ok) or [`Err`](#err)) with an contained value
equal to the contained value of the `Result` the method is being called on. If
the passed argument is not a `Result` or the contained values are not equal, 
`equals` will return `false`.

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

When an underlying value of a given `Result` is fixed to a `Semigroup`, `concat`
can be used to concat another `Result` instance with an underlying `Semigroup`
of the same type. Expecting a `Result` wrapping a `Semigroup` of the same type,
`concat` will give back a new `Result` instance wrapping the result of combining
the two underlying `Semigroup`s. When called on a [`Err`](#err) instance, `concat`
will return an [`Err`](#err) will return the first [`Err`](#err) in the chain.

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
//=> Err "Error 1"
```

#### map

```haskell
Result e a ~> (a -> b) -> Result e b
```

Used to apply transformations to values in the safety of a `Result`, `map` takes
a function that it will lift into the context of the `Result` and apply to it
the wrapped value. When run on an [`Ok`](#ok) instance, `map` will apply the wrapped
value to the provided function and return the result in a new [`Ok`](#ok) instance.
When run on an ['Err'](#err) instance `map` with return the error value in a new
[`Err`](#err) instance.

```javascript
import Result from 'crocks/Result'

import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import assign from 'crocks/helpers/assign'
import objOf from 'crocks/helpers/objOf'
import fanout from 'crocks/Pair/fanout'
import isNumber from 'crocks/predicates/isNumber'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid number`)

// prod :: Number -> Number -> Number
const prod =
  x => y => x * y

// fromNumber :: a -> Result
const fromNumber =
  ifElse(isNumber, Ok, buildError)

// doube :: a -> Result String Number
const double =
  compose(
    map(prod(2)),
    fromNumber
  )

double(21)
//=> Ok 42

double('down')
//=> Err "down is not a valid number"

// getParity :: Number -> Object
const getParity = compose(
  objOf('parity'),
  n => n % 2 === 0 ? 'Even' : 'Odd'
)

// getInfo :: a -> Object
const getInfo = compose(
  map(merge(assign)),
  map(fanout(objOf('value'), getParity)),
  fromNumber
)

getInfo(5324)
//=> Ok { parity: "Even", value: 5324 }

getInfo('down')
//=> Err "down is not a valid number"
```

#### alt

```haskell
Result e a ~> Result e a -> Result e a
```

Providing a means for a fallback or alternative value, `alt` combines two
`Result` instances and will return the first [`Ok`](#ok) it encounters or [`Err`](#err)
if it does not have an [`Ok`](#ok).

```javascript
import Result from 'crocks/result'

import alt from 'crocks/pointfree/alt'
import map from 'crocks/pointfree/map'
import reduce from 'crocks/pointfree/reduce'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'
import curry from 'crocks/core/curry'

const { Ok, Err } = Result

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, Err)

// gte :: Number -> Number -> Boolean
const gte =
  x => y => y >= x

// find :: (a -> Boolean) -> Foldable a -> Result String a
const find =
  curry(pred => compose(reduce(flip(alt), Err('Not found')), map(ensure(pred))))

Err('Error')
  .alt(Ok('Result'))
//=> Ok "Result"

Ok('Result')
  .alt(Err('Error'))
//=> Ok "Result"

Err('Error 1')
  .alt(Err('Error 2'))
//=> Ok "Error 1"

find(gte(41), [ 17, 25, 38, 42 ])
//=> Ok 42

find(gte(11), [ 1, 2, 3, 4 ])
//=> Err "Not found"
```

#### bimap

```haskell
Result e a ~> ((e -> d), (a -> b)) -> Result d b
```

While it's more common to [`map`](#map) over a `Result` that's an
[`Ok`](#ok) there comes a time when you need to map over a `Result` regardless
of wether it's an [`Ok`](#ok) or an [`Err`](#err).

`bimap` takes two mapping functions as its arguments. The first function is
used to map a [`Err`](#err) instance, while the second maps a [`Ok`](#ok). 
`Result` only provides a means to map an [`Ok`](#ok) instance exclusively using
[`map`](#map). If the need arises to map a [`Err`](#err) instance exclusively,
then `bimap` can be used, passing the mapping function to the first argument
and an [`identity`][identity] to the second.

```javascript
import Result from 'crocks/Result'

import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import setProp from 'crocks/helpers/setProp'
import compose from 'crocks/core/compose'
import identity from 'crocks/combinators/identity'
import objOf from 'crocks/helpers/objOf'
import isNumber from 'crocks/predicates/isNumber'
import bimap from 'crocks/pointfree/bimap'

const { Ok, Err } = Result

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, Err)

// buildError :: String -> String
const buildError = x => `${x} is not a valid number`

const prod =
  x => y => x * y

// fromNumber :: a -> Result String Number
const fromNumber = compose(
  bimap(buildError, identity),
  ensure(isNumber)
)

// hasError :: Boolean -> Object -> Object
const hasError =
  setProp('hasError')

// ResultObject :: { Boolean, Number, String }

// buildResult :: (String, Boolean) -> a -> ResultObject
const buildResult =
  (key, isError) =>
    compose(hasError(isError), objOf(key))

// finalize :: Result e a -> Result ResultObject ResultObject
const finalize = bimap(
  buildResult('error', true),
  buildResult('result', false)
)

// double :: a -> Result String Number
const double = compose(
  map(prod(2)),
  fromNumber
)

finalize(double(21))
//=> Ok { hasError: false, result: 42 }

finalize(double('unk'))
//=> Err { hasError: true, error: "unk is not a valid number" }
```

#### ap

```haskell
Result e (a -> b) ~> Result e a -> Result e b
```

Short for apply, `ap` is used to apply a `Result` instance containing a value
to another `Result` instance that contains a function, resulting in new `Result`
instance with the result. `ap` requires that it is called on an `instance` that
is either an [`Err`](#err) or an [`Ok`](#ok) that wraps a curried polyadic function.

When either instance is an [`Err`](#err), `ap` will return an [`Err`](#err). This can be
used to safely combine multiple values under a given combination function. If
any of the inputs results in an [`Err`](#err) than they will never be applied to
the function and not provide exceptions or unexpected results.

```javascript
import Result from 'crocks/Result'

import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid number`)

// prod :: Number -> Number -> Number
const prod =
  x => y => x * y

// fromNumber :: a -> Result String Number
const fromNumber =
  ifElse(isNumber, Ok, buildError)

map(prod, fromNumber(2))
  .ap(fromNumber(5))
//=> Ok 10

map(prod, fromNumber('string'))
  .ap(fromNumber(5))
//=> Err "string is not a valid number"

Ok(prod)
  .ap(fromNumber(2))
  .ap(fromNumber(21))
//=> Ok 42

Ok(prod)
  .ap(fromNumber('string'))
  .ap(fromNumber(21))
//=> Err "string is not a valid number"

liftA2(prod, fromNumber(2), fromNumber(21))
//=> Ok 42
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

`sequence` can be derived from [`traverse`](#traverse) by passing it an
`identity` function (`x => x`).

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
returning a new instance of the `Apply`, wrapping the result of the
`Apply`s "effect" on the value in the `Result`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the "effect"
of the target  `Apply` to the value inside of the `Result`. This will be used in
the case that the `Result` instance is a [`Err`](#err). Both arguments must provide
an instance of the target `Apply`.

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

// gte :: Number -> Number -> Boolean
const lte =
  y => x => x <= y

const ensure = pred => ifElse(pred, Ok, Err)

// tallyOf :: a -> [ a ]
const tallyOf =
  x => Pair(Sum.empty(), x)

// incBy :: Number -> Pair Sum Number
const incBy =
  x => Pair(Sum(x), x)

Ok(12)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 12, Ok 12 )

Err(true)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 0, Err true )

// lte10 :: Number -> Result Number Number
const lte10 = ensure(lte(10))

// update :: Number -> State Number Number
const update = x =>
  modify(state => x + state)
    .chain(constant(get()))

// updateSmall :: () => State Number Number
const updateSmall = () =>
  get(lte10)
    .chain(traverse(State, update))

updateSmall()
  .runWith(3)
//=> Pair( Ok 6, 6 )

updateSmall()
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Err 12, 12 )

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

import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'
import isDefined from 'crocks/core/isDefined'
import isNumber from 'crocks/predicates/isNumber'
import hasProp from 'crocks/predicates/hasProp'
import chain from 'crocks/pointfree/chain'
import bimap from 'crocks/pointfree/bimap'
import identity from 'crocks/combinators/identity'

const { Ok, Err } = Result

// buildError :: String -> Result String a
const buildError = x => Err(`${x} is not a valid value`)

// ensure :: (a -> bool) -> (a -> Result a a)
const ensure = pred => ifElse(pred, Ok, buildError)

// fromNumber :: a -> Result String Number
const fromNumber = ensure(isNumber)

// prop :: (String | Number) -> Object -> Result String a
const prop =
  name => compose(
    bimap(() => `${name} does not exist on the value given`, identity),
    chain(ensure(isDefined)),
    map(x => x[name]),
    ensure(hasProp(name))
  )

// prop :: Object -> Result String a
const getAge = prop('age')

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 = compose(map(x => x + 10), fromNumber)

getAge({ name: 'Sarah', age: 21 })
//=> Ok 21

getAge({ name: 'Sarah', age: 'unk' })
//=> Ok "unk"

chain(fromNumber, getAge({ name: 'Sarah', age: 21 }))
//=> Ok 21

getAge({ name: 'Sarah', age: 21 })
  .chain(fromNumber)
  .chain(protectedAdd10)
//=> Ok 31

getAge({ name: 'Sarah', age: 'unk' })
  .chain(fromNumber)
  .chain(protectedAdd10)
//=> Err "unk is not a valid value"

getAge({ name: 'Sarah' })
//=> Err "age does not exist on the object given"
```

#### coalesce

```haskell
Result e a ~> ((e -> b), (a -> b))) -> Result c b
```

There will come a time in your flow that you will want to ensure you have an
[`Ok`](#ok) of a given type. `coalesce` allows you to `map` over both the
[`Ok`](#ok) and the [`Err`](#err) and return an [`Ok`](#ok). `coalesce` expects
two functions for it's inputs. 

The first function is used when invoked on a [`Err`](#err) and will return a
[`Ok`](#ok) instance wrapping the result of the function. The second function
is used when `coalesce` is invoked on a [`Ok`](#ok) and is used to map the
original value, returning a new [`Ok`](#ok) instance wrapping the result of the second function.

```javascript
import Result from 'crocks/Result'

import map from 'crocks/pointfree/map'
import coalesce from 'crocks/pointfree/coalesce'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'
import isNumber from 'crocks/predicates/isNumber'
import chain from 'crocks/pointfree/chain'
import isObject from 'crocks/predicates/isObject'
import hasProp from 'crocks/predicates/hasProp'
import identity from 'crocks/combinators/identity'
import constant from 'crocks/combinators/constant'
import assign from 'crocks/helpers/assign'
import fanout from 'crocks/Pair/fanout'
import merge from 'crocks/Pair/merge'
import objOf from 'crocks/helpers/objOf'
import assoc from 'crocks/helpers/assoc'

const { Err, Ok } = Result

// gte :: Number -> Number -> Boolean
const gte =
  y => x => x >= y

const ensure = pred => ifElse(pred, Ok, Err)

const fromNumber = ensure(isNumber)

const ensureIsObject = ensure(isObject)

fromNumber(45)
  .coalesce(constant(42), identity)
//=> Ok 45

fromNumber('number')
  .coalesce(constant(42), identity)
//=> Ok 42

const hasAge = ensure(hasProp('age'))

const prop =
  name => x => x[name]

const ensureHasAge = compose(
  coalesce(assoc('age', 0), identity),
  chain(hasAge),
  coalesce(constant({}), identity),
  ensureIsObject
)

const setCanDrink = compose(
  merge(assign),
  map(compose(objOf('canDrink'), gte(18))),
  fanout(identity, prop('age'))
)

const getDetails = compose(
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

import identity from 'crocks/combinators/identity'
import swap from 'crocks/pointfree/swap'
import isNumber from 'crocks/predicates/isNumber'
import compose from 'crocks/core/compose'
import ifElse from 'crocks/logic/ifElse'
import constant from 'crocks/combinators/constant'

const { Ok, Err } = Result

const simpleSwap =
  swap(identity, identity)

simpleSwap(Ok(42))
//=> Err 42

simpleSwap(Err(21))
//=> Ok 21

const ensure = (pred, f) => ifElse(pred, Ok, compose(Err, f))

const fromNumber = ensure(isNumber, x => `${x} is not a valid number`)

const swapWithDefault =
  swap(constant(0), x => `${x} is not a valid value`)

swapWithDefault(fromNumber(4))
//=> Err "4 is not a valid value"

swapWithDefault(fromNumber('number'))
//=> Ok 0
```

#### either

```haskell
Result e a ~> ((e -> b), (a -> b)) -> b
```

Used to provide a means to map a given `Result` instance folding it out of it's
container. `either` expects two functions as its arguments. The first is a
function that will be used to map an [`Err`](#err). While the second
will map the value wrapped in a given [`Ok`](#ok) and return the result of that
mapping.

By using composing `either` you can create functions that us the power of 
`ADT`s while returning a plain javascript type.

```javascript
import Result from 'crocks/Result'

import either from 'crocks/pointfree/either'
import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'
import isNumber from 'crocks/predicates/isNumber'
import setProp from 'crocks/helpers/setProp'
import objOf from 'crocks/helpers/objOf'

const { Ok, Err } = Result

const ensure = (pred, f) => ifElse(pred, Ok, compose(Err, f))

const fromNumber = ensure(isNumber, x => `${x} is not a valid number`)

const prod =
  x => y => x * y

// hasError :: Boolean -> Object -> Object
const hasError =
  setProp('hasError')

// buildResult :: (String, Boolean) -> a -> Object
const buildResult = (key, isError) =>
  compose(hasError(isError), objOf(key))

const createResult =
  either(
    buildResult('error', true),
    buildResult('result', false)
  )

const double = compose(
  createResult,
  map(prod(2)),
  fromNumber
)

double(42)
//=> { result: 84, hasError: false }

double('value')
//=> { error: 'value is not a valid number', hasError: true }
```

</article>

<article id="topic-helpers">

## Helper Functions


#### TryCatch

`crocks/Result/tryCatch`

```haskell
TryCatch :: (* -> a) -> * -> Result e a
```
Used when you you want to take any variadic function and wrap it with the added
function of a `Result` type. `tryCatch` will execute the function with the 
parameters passed and return either an [`Ok`](#ok) when successful or an 
[`Err`](#err) when an exception is thrown.

It is important to note that as of now `tryCatch` does not currently support
any type of curried function. `tryCatch` applies all arguments to the top-level
function.

```javascript
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

Used to transform a given [`Either`][either] instance to a `Result`
instance or flatten a `Result` of `Either` into a `Result` when chained, 
`eitherToMaybe` will turn a [`Right`][right] instance into
a [`Ok`](#ok) wrapping the original value contained in the [`Right`][right].
All [`Left`][left] instances will map to a [`Err`](#err), mapping the
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
import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import fanout from 'crocks/Pair/fanout'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'
import maybeToEither from 'crocks/Result/maybeToEither'
import merge from 'crocks/Pair/merge'
import objOf from 'crocks/helpers/objOf'
import prop from 'crocks/Maybe/prop'
import eitherToResult from 'crocks/Either/eitherToResult'
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
  composeK(safeInc, prop(key))

// incResult :: String -> a -> Result [ String ] Object
const incResult = key => maybeToEither(
  [ `${key} is not valid` ],
  compose(map(objOf(key)), incProp(key))
)

// incThem :: a -> Result [ String ] Object
const incThem = compose(
  merge(liftA2(assign)),
  fanout(incResult('b'), incResult('a'))
)

Result.of({})
  .chain(eitherToResult(incThem))
//=> Err [ "b is not valid", "a is not valid" ]

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

Used to transform a given [`First`][first] instance to a `Result`
instance or flatten a `Result` of [`First`][first] into a `Result` when chained, 
`firstToMaybe` will turn a non-empty instance into an [`Ok`](#ok) wrapping
the original value contained within the [`First`][first]. All empty instances
will map to an [`Err`](#err) with the given value.

Like all `crocks` transformation functions, `firstToMaybe` has two possible
signatures and will behave differently when passed either
a [`First`][first] instance or a function that returns an instance
of [`First`][first]. When passed the instance, a transformed `Result` is
returned. When passed a [`First`][first] returning function, a function will be
returned that takes a given value and returns a `Result`.

```javascript
import First from 'crocks/First'

import firstToResult from 'crocks/Result/firstToResult'
import flip from 'crocks/combinators/flip'
import prop from 'crocks/Maybe/prop'
import mapReduce from 'crocks/helpers/mapReduce'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'

const { empty } = First

// Person :: (String, Number)

// createPerson :: (String, Number) -> Person
const createPerson = (name, age) => ({
  name, age
})

// liftName :: Person -> First (Maybe String)
const liftName = compose(First, prop('name'))

// mergeFirstName :: [Person] -> First (Maybe String)
const mergeFirstName = compose(firstToResult('(No name found)'), mapReduce(liftName, flip(concat), empty()))

mergeFirstName([
  createPerson('John', 30),
  createPerson('Jon', 33)
])
//=> Ok "Jon"

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

Used to transform a given [`Maybe`][maybe] instance to a `Result`
instance or flatten a `Result` of [`Maybe`][maybe] into a `Result` when chained, 
`maybeToResult` will turn a [`Just`][just] instance into an [`Ok`](#ok) wrapping the
original value contained in the [`Just`][just].
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

import maybeToResult from 'crocks/Result/maybeToResult'
import Maybe from 'crocks/Maybe'
import prop from 'crocks/Maybe/prop'
import compose from 'crocks/helpers/compose'

const { Ok } = Result
const { Just, Nothing } = Maybe

maybeToResult('An error occurred', Just('21'))
//=> Ok "21"

maybeToResult('An error occurred', Nothing())
//=> Err "An error occurred"

const getProp = compose(maybeToResult('The requested prop did not exist or was undefined'), prop)

getProp('name', { name: 'Jobn', age: 21 })
//=> Ok "Jobn"

getProp('name', { age: 27 })
//=> Err "The requested prop did not exist or was undefined"

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