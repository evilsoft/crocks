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

Result is a Sum Type a step above `Result`. With a `Result` the
left side contains no information, where as with a `Result` the left contains
the error information from an operation. `Result` is well suited for capturing 
disjunction when the cause of the "error" case needs to be communicated. For 
example, when executing a function and you exception is important or useful.

A `Result` represents disjunction by using two constructors, [`Err`](#err) or [`Ok`](#ok).
An [`Ok`](#ok) instance represents the positive result while [`Err`](#err) is considered
the negative. With the exception of [`coalesce`](#coalesce), [`swap`](#swap)
and [`bimap`](#bimap), all `Result` returning methods on an instance will be
applied to a [`Ok`](#ok) returning the result. If an instance is a [`Err`](#err), then all application is skipped and another [`Err`](#err) is returned.

It is recommended to use the available [`Ok`](#ok) and [`Err`](#err)
constructors to construct `Result` instances in most cases. You can use the
`Result` constructor to construct a [`Ok`](#ok), but it will read better to just use
`Ok`.

```javascript
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
constructed using its TypeRep like any other type. The `Result` constructor is a
unary function that accepts any type `a` and returns a [`Ok`](#ok) instance, wrapping
the value passed to its argument.

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

```javascript
import Result from 'crocks/Result'

import chain from 'crocks/pointfree/chain'
import isNumber from 'crocks/predicates/isNumber'
import ifElse from 'crocks/logic/ifElse'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid number`)

// add10 :: Number -> Number
const add10 =
  x => x + 10

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 =
    ifElse(isNumber, x => Ok(add10(x)), buildError)

Ok(23)
  .map(add10)
//=> Ok 33

Err(23)
  .map(add10)
//=> Err

chain(protectedAdd10, Ok(10))
//=> Ok 20

chain(protectedAdd10, Err('d'))
//=> Err "d is not a valid number"
```

#### Ok

```haskell
Result.Ok :: a -> Result e a
```

Used to construct a [`Ok`](#ok) instance that represents the "true" portion of a
disjunction or a valid value.  [`Ok`](#ok) will wrap any given value in
a [`Ok`](#ok), signaling the validity of the wrapped value.

```javascript
import Result from 'crocks/Result'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid string`)

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

const ensureString =
    ifElse(isString, Ok, buildError)

Ok(32)
//=> Ok 32

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

Used to compare the underlying values of two `Result` instances for equality by
value. `equals` takes any given argument and returns `true` if the passed 
arguments is a `Result` ([`Ok`](#ok) or [`Err`](#err)) with an underlying value
equal to the underlying value of the `Result` the method is being called on. If
the passed argument is not a `Result` or the underlying values are not equal, 
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

const prod =
  x => y => x * y

const fromNumber =
  ifElse(isNumber, Ok, buildError)

const double =
  compose(
    map(prod(2)),
    fromNumber
  )

double(21)
//=> Ok 42

double('down')
//=> Err "down is not a valid number"

const getParity = compose(
  objOf('parity'),
  n => n % 2 === 0 ? 'Even' : 'Odd'
)

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

const check =
  pred => ifElse(pred, Ok, Err)

// gte :: Number -> Number -> Boolean
const gte =
  x => y => y >= x

const find =
  curry(pred => compose(reduce(flip(alt), Err('Not found')), map(check(pred))))

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
import objOf from 'crocks/helpers/objOf'
import isNumber from 'crocks/predicates/isNumber'
import bimap from 'crocks/pointfree/bimap'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid number`)

const prod =
  x => y => x * y

const fromNumber =
  ifElse(isNumber, Ok, buildError)

// hasError :: Boolean -> Object -> Object
const hasError =
  setProp('hasError')

// buildResult :: (String, Boolean) -> a -> Object
const buildResult = (key, isError) =>
  compose(hasError(isError), objOf(key))

const finalize =
  bimap(
    buildResult('error', true),
    buildResult('result', false)
  )

const double =
  compose(
    map(prod(2)),
    fromNumber
  )

finalize(double(21))
//=> Ok { result: 42, hasError: false }

finalize(double('unk'))
//=> Err { error: "unk is not a valid number", hasError: true }
```

#### ap

```haskell
Result e (a -> b) ~> Result e a -> Result e b
```

Short for apply, `ap` is used to apply a `Result` instance containing a value
to another `Result` instance that contains a function, resulting in new `Result`
instance with the result. `ap` requires that it is called on an `instance` that
is either a [`Err`](#err) or a [`Ok`](#ok) that wraps a curried polyadic function.

When either `Result` is a [`Err`](#err), `ap` will return a [`Err`](#err). This can be
used to safely combine multiple values under a given combination function. If
any of the inputs results in a [`Err`](#err) than they will never be applied to
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

const prod =
  x => y => x * y

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
```

#### chain

```haskell
Result e a ~> (a -> Result e b) -> Result e b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with `chain`. `chain` expects a unary, `Result` returning function
as its argument. When invoked on a [`Err`](#err), `chain` will not run the function,
but will instead return another [`Err`](#err). When called on a [`Ok`](#ok) however, the
inner value will be passed to provided function, returning the result as the
new instance.

```javascript
import Result from 'crocks/Result'

import map from 'crocks/pointfree/map'
import ifElse from 'crocks/logic/ifElse'
import compose from 'crocks/core/compose'
import isDefined from 'crocks/core/isDefined'
import isNumber from 'crocks/predicates/isNumber'
import chain from 'crocks/pointfree/chain'
import not from 'crocks/logic/not'
import isNil from 'crocks/predicates/isNil'
import bimap from 'crocks/pointfree/bimap'
import identity from 'crocks/combinators/identity'

const { Ok, Err } = Result

const ensure = (pred, f) => ifElse(pred, Ok, compose(Err, f))

const ensureNotIsNil = ensure(not(isNil), () => 'The value given was nil')

const ensureDefined = ensure(isDefined, () => 'The value given was undefined')

const prop =
  name =>
    compose(
      bimap(() => `${name} does not exist on the value given`, identity),
      chain(ensureDefined),
      map(x => x[name]),
      ensureNotIsNil
    )

const fromNumber = ensure(isNumber, x => `${x} is not a valid number`)

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
//=> Err "unk is not a valid number"

getAge({ name: 'Sarah' })
//=> Err "age does not exist on the value given"
```

#### coalesce

```haskell
Result e a ~> ((e -> b), (a -> b))) -> Result c b
```

When one would like to [`option`](#option) a `Result` but would like to remain
within a `Result` type, `coalesce` can be used. `coalesce` expects two functions
for it's inputs.

The first function is used when invoked on a [`Err`](#err) and will return a [`Ok`](#ok)
instance wrapping the result of the function. The second function is used when
`coalesce` is invoked on a [`Ok`](#ok) and is used to map the original value,
returning a new [`Ok`](#ok) instance wrapping the result of the second function.

```javascript
```

#### swap

```haskell
Result e a ~> ((e -> a), (a -> e)) -> Result e a
```

```javascript
```

#### either

```haskell
Result e a ~> ((e -> b), (a -> b)) -> b
```

Used to provide a means to map a given `Result` instance while optioning out the
wrapped value. `either` expects two functions as its arguments. The first is a
function that will be used to map an [`Err`](#err). While the second
will map the value wrapped in a given [`Ok`](#ok) and return the result of that
mapping.


```javascript
```

</article>

<article id="topic-helpers">

## Helper Functions


#### TryCatch

`crocks/Result/tryCatch`

```haskell
TryCatch :: (* -> a) -> * -> Result e a
```

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
```

#### maybeToResult

`crocks/Result/maybeToResult`

```haskell
maybeToResult :: e -> Maybe a -> Result e a
maybeToResult :: e -> (a -> Maybe b) -> a -> Result e b
```

Used to transform a given [`Maybe`][maybe] instance to a `Result`
instance or flatten a `Result` of [`Maybe`][maybe] into a `Result` when chained, 
`maybeToResult` will turn an [`Just`][just] instance into a [`Ok`](#ok) wrapping the
original value contained in the [`Just`][just].
All [`Err`](#err) instances will map to a [`Err`](#err), mapping the originally
contained value to a `Unit`. Values on the [`Err`](#err) will be lost and as such this
transformation is considered lossy in that regard.

Like all `crocks` transformation functions, `maybeToResult` has two possible
signatures and will behave differently when passed either an `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `Result` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns a `Result`.

```javascript
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
