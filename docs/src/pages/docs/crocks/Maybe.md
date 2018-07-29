---
title: "Maybe"
description: "Maybe Crock"
layout: "guide"
functions: ["find", "prop", "proppath", "safe", "safeafter", "safelift", "eithertomaybe", "firsttomaybe", "lasttomaybe", "resulttomaybe"]
weight: 90
---

```haskell
Maybe a = Nothing | Just a
```

Defined as a Sum Type with its left side fixed to `()` (`Nothing`), `Maybe` is
well suited for capturing disjunction when the cause of the "error" case does
not need to be communicated. For example, providing default values on specific
conditions.

A `Maybe` represents disjunction by using two constructors, `Nothing` or `Just`.
A `Just` instance represents the truth case while `Nothing` is considered
false. With the exception of [`coalesce`](#coalesce), all `Maybe` returning
methods on an instance will be applied to a `Just` returning the result. If an
instance is a `Nothing`, then all application is skipped and another `Nothing`
is returned.

It is recommended to use the available [`Just`](#just) and [`Nothing`](#nothing)
constructors to construct `Maybe` instances in most cases. You can use the
`Maybe` constructor to construct a `Just`, but it may read better to just use
`Just`.

```javascript
import Maybe from 'crocks/Maybe'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Just, Nothing } = Maybe

// gt5 :: Number -> Boolean
const gt5 =
  x => x > 5

// safe :: (a -> Boolean) -> a -> Maybe b
const safe = pred =>
  ifElse(pred, Just, Nothing)

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// maybeBig :: Number -> Maybe Number
const maybeBig =
  safe(gt5)

// bigNumber :: a -> Maybe Number
const bigNumber = compose(
  chain(maybeBig), safeNumber
)

safeNumber(45)
//=> Just 45

safeNumber('99')
//=> Nothing

maybeBig(99)
//=> Just 99

maybeBig(2)
//=> Nothing

bigNumber(34)
//=> Just 34

bigNumber('string')
//=> Nothing

bigNumber(3)
//=> Nothing
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Plus`, `Apply`, `Traversable`,
`Chain`, `Applicative`, `Alternative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Maybe :: a -> Maybe a
```

Most of the time, `Maybe` is constructed using helper functions
like [`safe`](#safe) or by employing one of the instance
constructors, [`Just`](#just) or [`Nothing`](#nothing). This is due to the
nature of `Maybe` and most other Sum Types.

As a matter of consistency and completion, a `Maybe` instance can also be
constructed using its TypeRep like any other type. The `Maybe` constructor is a
unary function that accepts any type `a` and returns a `Just` instance, wrapping
the value passed to its argument.

```javascript
import Maybe from 'crocks/Maybe'
import equals from 'crocks/pointfree/equals'

Maybe('some string')
//=> Just "some string"

Maybe(null)
//=> Just null

Maybe(undefined)
//=> Just undefined

Maybe.of('some string')
//=> Just "some string"

Maybe.of(null)
//=> Just null

Maybe.of(undefined)
//=> Just undefined

Maybe.Just('some string')
//=> Just "some string"

Maybe.Just(null)
//=> Just null

Maybe.Just(undefined)
//=> Just undefined

equals(
  Maybe.Just([ 1, 2, 3 ]),
  Maybe.of([ 1, 2, 3 ])
)
//=> true

equals(
  Maybe.of({ a: 100 }),
  Maybe({ a: 100 })
)
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Nothing

```haskell
Maybe.Nothing :: () -> Maybe a
```

Used to construct a `Nothing` instance that represents the "false" portion of
a disjunction. When an instance is a `Nothing`, most `Maybe` returning methods
will just return another `Nothing`. Anything passed to the constructor will
be thrown out and mapped to `()`.

```javascript
import Maybe from 'crocks/Maybe'

import chain from 'crocks/pointfree/chain'
import isNumber from 'crocks/predicates/isNumber'
import safeLift from 'crocks/Maybe/safeLift'

const { Just, Nothing } = Maybe

// add10 :: Number -> Number
const add10 =
  x => x + 10

// safeAdd10 :: a -> Maybe Number
const safeAdd10 =
  safeLift(isNumber, add10)

Just(23)
  .map(add10)
//=> Just 33

Nothing(23)
  .map(add10)
//=> Nothing

chain(safeAdd10, Just(10))
//=> Just 20

chain(safeAdd10, Nothing())
//=> Nothing
```

#### Just

```haskell
Maybe.Just :: a -> Maybe a
```

Used to construct a `Just` instance that represents the "true" portion of a
disjunction or a valid value.  `Just` will wrap any given value in
a `Just`, signaling the validity of the wrapped value.

```javascript
import Maybe from 'crocks/Maybe'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'

const { Just, Nothing } = Maybe

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// safe :: (a -> Boolean) -> a -> Maybe a
const safe =
  pred => ifElse(pred, Just, Nothing)

// safeShout :: a -> Maybe String
const safeShout = compose(
  map(toUpper),
  safe(isString)
)

safeShout(45)
//=> Nothing

safeShout('Hey there!')
//=> Just "HEY THERE!"
```

#### of

```haskell
Maybe.of :: a -> Maybe a
```

Used to wrap any value into a `Maybe` as a `Just`, `of` is used mostly by
helper functions that work "generically" with instances of
either `Applicative` or `Monad`. When working specifically with
the `Maybe` type, the [`Just`](#just) constructor should be used. Reach
for `of` when working with functions that will work with
ANY `Applicative`/`Monad`.

```javascript
import Maybe from 'crocks/Maybe'

import curry from 'crocks/helpers/curry'
import isString from 'crocks/predicates/isString'
import safe from 'crocks/Maybe/safe'

const { Just } = Maybe

Maybe(35)
//=> Just 35

Just(35)
//=> Just 35

Maybe.of(35)
//=> Just 35

const safeString =
  safe(isString)

// lift2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
const lift2 = curry(
  (fn, x, y) => x.of(fn).ap(x).ap(y)
)

// join :: Applicative m => m String -> m String -> m String
const join =
  lift2(a => b => `${a} ${b}`)

join(safeString('Brad'), safeString('Pitt'))
//=> Just "Brad Pitt"

join(safeString(34), safeString('Pitt'))
//=> Nothing
```

#### zero

```haskell
Maybe.zero :: () -> Maybe a
```

When working with `Alt`s, `zero` provides a sort of `empty` or identity for
`Maybe` when used with [`alt`](#alt). `zero` takes no arguments and returns a
`Nothing` instance. Just like an `empty` method on a given `Monoid`, `zero`
can be used to fold a collection of `Alt`s under `alt`.

```javascript
import Maybe from 'crocks/Maybe'

import alt from 'crocks/pointfree/alt'
import flip from 'crocks/combinators/flip'
import isNumber from 'crocks/predicates/isNumber'
import mapReduce from 'crocks/helpers/mapReduce'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just, zero } = Maybe

// firstValid :: [ * ] -> Maybe Number
const firstValid =
  mapReduce(safe(isNumber), flip(alt), zero())

Just(33)
  .alt(zero())
//=> Just 33

zero()
  .alt(Just(33))
//=> Just 33

Nothing()
  .alt(zero())
//=> Nothing

zero()
  .alt(Nothing())
//=> Nothing

firstValid([ null, 'nope', 10, 45 ])
//=> Just 10

firstValid([ 75, null, 'nope' ])
//=> Just 75

firstValid([ null, undefined, 'wrong' ])
//=> Nothing
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Maybe a ~> b -> Boolean
```

Used to compare the underlying values of two `Maybe` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
arguments is a `Maybe` with an underlying value equal to the underlying value
of the `Maybe` the method is being called on. If the passed argument is not
a `Maybe` or the underlying values are not equal, `equals` will return `false`.

```javascript
import Maybe from 'crocks/Maybe'

import equals from 'crocks/pointfree/equals'

const { Nothing, Just } = Maybe

Just(33)
  .equals(Just(33))
//=> true

Nothing()
  .equals(Nothing())
//=> true

Nothing()
  .equals(Just(33))
//=> false

// by value, not reference for most types
Just({ a: 86, b: true })
  .equals(Just({ a: 86, b: true }))
//=> true

equals(Just(95), 95)
//=> false

equals(undefined, Nothing())
//=> false

equals(Just([ 2, 3 ]), Just([ 2, 3 ]))
//=> true
```

#### concat

```haskell
Semigroup s => Maybe s ~> Maybe s -> Maybe s
```

When an underlying value of a given `Maybe` is fixed to a `Semigroup`, `concat`
can be used to concat another `Maybe` instance with an underlying `Semigroup`
of the same type. Expecting a `Maybe` wrapping a `Semigroup` of the same type,
`concat` will give back a new `Maybe` instance wrapping the result of combining
the two underlying `Semigroup`s. When called on a `Nothing` instance, `concat`
will return a `Nothing`.

```javascript
import Maybe from 'crocks/Maybe'

import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import flip from 'crocks/combinators/flip'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import mapReduce from 'crocks/helpers/mapReduce'
import safeLift from 'crocks/Maybe/safeLift'
import valueOf from 'crocks/pointfree/valueOf'

const { Nothing, Just } = Maybe

// safeSum :: a -> Maybe Sum
const safeSum =
  safeLift(isNumber, Sum)

// empty :: Maybe Sum
const empty =
  Just(Sum.empty())

// sumList :: [ * ] -> Maybe Number
const sumList = compose(
  map(valueOf),
  mapReduce(safeSum, flip(concat), empty)
)

Just([ 34 ])
  .concat(Just([ 92 ]))
//=> Just [ 34, 92 ]

Just([ 34 ])
  .concat(Nothing())
//=> Nothing

sumList([ 3, 4, 5 ])
//=> Just 12

sumList([ 'three', 4, 'five' ])
//=> Nothing
```

#### map

```haskell
Maybe a ~> (a -> b) -> Maybe b
```

Used to apply transformations to values in the safety of a `Maybe`, `map` takes
a function that it will lift into the context of the `Maybe` and apply to it
the wrapped value. When ran on a `Just` instance, `map` will apply the wrapped
value to the provided function and return the result in a new `Just` instance.


```javascript
import Maybe from 'crocks/Maybe'

import assign from 'crocks/helpers/assign'
import compose from 'crocks/helpers/compose'
import isObject from 'crocks/predicates/isObject'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just } = Maybe

// add10 :: Number -> Number
const add10 =
  x => x + 10

// toUpper :: String -> String
const toUpper = x =>
  x.toUpperCase()

// safeObj :: a -> Maybe Object
const safeObj =
  safe(isObject)

// shout :: a -> Maybe String
const shout = x =>
  safe(isString, x)
    .map(toUpper)

// setProcessed :: a -> Maybe Object
const setProcessed = compose(
  map(assign({ processed: true })),
  safeObj
)

Just(0)
  .map(add10)
//=> Just 10

Nothing()
  .map(add10)
//=> Nothing

shout('good news')
//=> Just "GOOD NEWS"

shout(33)
//=> Nothing

setProcessed({ cheese: true })
//=> Just { cheese: true, processed: true }

setProcessed(null)
//=> Nothing
```

#### alt

```haskell
Maybe a ~> Maybe a -> Maybe a
```

Providing a means for a fallback or alternative value, `alt` combines two
`Maybe` instances and will return the first `Just` it encounters or `Nothing`
if it does not have a `Just`. This can be used in conjunction with
[`zero`](#zero) to return the first valid value in contained in a `Foldable`
structure.

```javascript
import Maybe from 'crocks/Maybe'

import alt from 'crocks/pointfree/alt'
import isArray from 'crocks/predicates/isArray'
import flip from 'crocks/combinators/flip'
import mapReduce from 'crocks/helpers/mapReduce'
import safe from 'crocks/Maybe/safe'

const { zero, Nothing, Just } = Maybe

// firstArray :: Foldable f => f * -> Maybe Array
const firstArray =
  mapReduce(safe(isArray), flip(alt), zero())

Nothing()
  .alt(Just(33))
//=> Just 33

Just(42)
  .alt(Nothing())
  .alt(Just(99))
//=> Just 42

firstArray([ 'Not Array', null, [ 2, 3, 4 ], [ 1, 2 ] ])
//=> Just [ 2, 3, 4 ]

firstArray([ null, 5, '76' ])
//=> Nothing
```

#### ap

```haskell
Maybe (a -> b) ~> Maybe a -> Maybe b
```

Short for apply, `ap` is used to apply a `Maybe` instance containing a value
to another `Maybe` instance that contains a function, resulting in new `Maybe`
instance with the result. `ap` requires that it is called on an `instance` that
is either a `Nothing` or a `Just` that wraps a curried polyadic function.

When either `Maybe` is a `Nothing`, `ap` will return a `Nothing`. This can be
used to safely combine multiple values under a given combination function. If
any of the inputs results in a `Nothing` than they will never be applied to
the function and not provide exceptions or unexpected results.

```javascript
import Maybe from 'crocks/Maybe'

import compose from 'crocks/helpers/compose'
import chain from 'crocks/pointfree/chain'
import curry from 'crocks/helpers/curry'
import fanout from 'crocks/helpers/fanout'
import isString from 'crocks/predicates/isString'
import liftA2 from 'crocks/helpers/liftA2'
import merge from 'crocks/pointfree/merge'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just } =  Maybe

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// joinWith :: String -> String -> String -> String
const joinWith = curry(
  (del, x, y) => x + del + y
)

// stringProp :: String -> a -> Maybe String
const stringProp = key => compose(
  chain(safe(isString)),
  prop(key)
)

// getNames :: a -> Pair (Maybe String) (Maybe String)
const getNames = fanout(
  stringProp('first'),
  stringProp('last')
)

// joinNames :: Pair (Maybe String) (Maybe String) -> Maybe String
const joinNames =
  merge(liftA2(joinWith(' ')))

// fullName :: a -> Maybe String
const fullName =
  compose(joinNames, getNames)

Maybe.of(add)
  .ap(Just(5))
  .ap(Just(27))
//=> Just 32

Just('hello')
  .map(joinWith(' -- '))
  .ap(Just('friend'))
//=> Just "hello -- friend"

Maybe.of(add)
  .ap(Just(29))
  .ap(Nothing())
//=> Nothing

fullName({ first: 'Joey', last: 'Fella' })
//=> Just "Joey Fella"

fullName(null)
//=> Nothing

fullName({ first: 'Lizzy' })
//=> Nothing
```

#### sequence

```haskell
Apply f => Maybe (f a) ~> (b -> f b) -> f (Maybe a)
Applicative f => Maybe (f a) ~> TypeRep f -> f (Maybe a)
```

When an instance of `Maybe` wraps an `Apply` instance, `sequence` can be used to
swap the type sequence. `sequence` requires either an `Applicative TypeRep` or
an `Apply` returning function is provided for its argument. This will be used in
the case that the `Maybe` instance is a `Nothing`.

`sequence` can be derived from [`traverse`](#traverse) by passing it an
`identity` function (`x => x`).

```javascript
import Maybe from 'crocks/Maybe'

import Identity from 'crocks/Identity'
import sequence from 'crocks/pointfree/sequence'

const { Nothing, Just } = Maybe

// seqId :: Maybe Identity a -> Identity Maybe a
const seqId =
  sequence(Identity)

seqId(Just(Identity(34)))
//=> Identity Just 34

seqId(Nothing())
//=> Identity Nothing
```

#### traverse

```haskell
Apply f => Maybe a ~> (c -> f c), (a -> f b)) -> f Maybe b
Applicative f => Maybe a ~> (TypeRep f, (a -> f b)) -> f Maybe b
```

Used to apply the "effect" of an `Apply` to a value inside of a `Maybe`,
`traverse` combines both the "effects" of the `Apply` and the `Maybe` by
returning a new instance of the `Apply`, wrapping the result of the
`Apply`s "effect" on the value in the `Maybe`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the "effect"
of the target  `Apply` to the value inside of the `Maybe`. This will be used in
the case that the `Maybe` instance is a `Nothing`. Both arguments must provide
an instance of the target `Apply`.

```javascript
import IO from 'crocks/IO'

import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'
import safe from 'crocks/Maybe/safe'
import traverse from 'crocks/pointfree/traverse'

// someGlobal :: Number
let someGlobal = 10

// addToGlobal :: Number -> IO Number
const addToGlobal = x => IO(function() {
  someGlobal = someGlobal + x
  return someGlobal
})

// safeAddToGlobal :: a -> IO (Maybe Number)
const safeAddToGlobal = compose(
  traverse(IO, addToGlobal),
  safe(isNumber)
)

safeAddToGlobal(32)
  .run()
//=> Just 42
//someGlobal => 42

safeAddToGlobal(undefined)
  .run()
//=> Nothing
//someGlobal => 42
```

#### chain

```haskell
Maybe a ~> (a -> Maybe b) -> Maybe b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with `chain`. `chain` expects a unary, `Maybe` returning function
as its argument. When invoked on a `Nothing`, `chain` will not run the function,
but will instead return another `Nothing`. When called on a `Just` however, the
inner value will be passed to provided function, returning the result as the
new instance.

```javascript
import Maybe from 'crocks/Maybe'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'
import isString from 'crocks/predicates/isString'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'
import safeLift from 'crocks/Maybe/safeLift'

const { Nothing, Just } = Maybe

// double :: Number -> Number
const double =
  x => x + x

// chainNumber :: Maybe a -> Maybe Number
const chainNumber =
  chain(safe(isNumber))

// doubleValue :: a -> Maybe Number
const doubleValue = compose(
  chain(safeLift(isNumber, double)),
  prop('value')
)

chainNumber(Just(45))
//=> Just 45

chainNumber(Nothing())
//=> Nothing

Just(45)
  .chain(safe(isString))
//=> Nothing

doubleValue(undefined)
//=> Nothing

doubleValue({ value: '45' })
//=> Nothing

doubleValue({ number: 45 })
//=> Nothing

doubleValue({ value: 45 })
//=> Just 90
```

#### coalesce

```haskell
Maybe a ~> ((() -> b), (a -> b))) -> Maybe b
```

When one would like to [`option`](#option) a `Maybe` but would like to remain
within a `Maybe` type, `coalesce` can be used. `coalesce` expects two functions
for it's inputs.

The first function is used when invoked on a `Nothing` and will return a `Just`
instance wrapping the result of the function. The second function is used when
`coalesce` is invoked on a `Just` and is used to map the original value,
returning a new `Just` instance wrapping the result of the second function.

```javascript
import Maybe from 'crocks/Maybe'

import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import coalesce from 'crocks/pointfree/coalesce'
import constant from 'crocks/combinators/constant'
import identity from 'crocks/combinators/identity'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import objOf from 'crocks/helpers/objOf'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just } = Maybe

// shout :: String -> String
const shout =
  x => x.toUpperCase()

// defaultString :: Maybe String -> Maybe String
const defaultString =
  coalesce(constant(''), identity)

// shoutOut :: String -> Object
const shoutOut = compose(
  objOf('shout'),
  shout
)

// stringValue :: a -> Maybe String
const stringValue = composeK(
  safe(isString),
  prop('value')
)

// shoutValue :: a -> Maybe Object
const shoutValue = compose(
  map(shoutOut),
  defaultString,
  stringValue
)

Just(76)
  .coalesce(constant(0), identity)
//=> Just 76

Nothing()
  .coalesce(constant(0), identity)
//=> Just 0

shoutValue({ value: 'hello' })
//=> Just { shout: 'HELLO' }

shoutValue(undefined)
//=> Just { shout: '' }

shoutValue({ value: 49 })
//=> Just { shout: '' }

shoutValue({})
//=> Just { shout: '' }
```

#### option

```haskell
Maybe a ~> a -> a
```

Used as the primary way to "fold" a value out of a `Maybe`, `option` expects a
default value. The default value provided will be returned when `option` is
invoked on a `Nothing` instance. When invoked on a `Just`, the underlying value
is returned, discarding the provided default value. `option` is typically ran
at the "edge" of a flow, to provide default values for complicated
representations of disjunction.

When the need to immediately map the result of optioning a `Maybe` arises,
then [`either`](#either) may be employed to combine it in one operation.

```javascript
import Maybe from 'crocks/Maybe'

const { Nothing, Just } = Maybe

Nothing()
  .option(0)
//=> 0

Just(99)
  .option(0)
//=> 99
```

#### either

```haskell
Maybe a ~> ((() -> b), (a -> b)) -> b
```

Used to provide a means to map a given `Maybe` instance while optioning out the
wrapped value. [`option`](#option) can handle most cases for optioning `Maybe`,
but does not provide a means to map a given value at the time of
optioning. `either` expects two functions as its arguments. The first is a
pointed function that will be used when invoked on a `Nothing`. While the second
will map the value wrapped in a given `Just` and return the result of that
mapping.


```javascript
import Maybe from 'crocks/Maybe'

import either from 'crocks/pointfree/either'

const { Nothing, Just } = Maybe

// wrap :: a -> [ a ]
const wrap =
  x => [ x ]

// empty :: () -> [ a ]
const empty =
  () => []

// toArray :: Maybe a -> [ a ]
const toArray =
  either(empty, wrap)

toArray(Just(56))
//=> [ 56 ]

toArray(Nothing())
//=> []
```

</article>

<article id="topic-helpers">

## Helper Functions


#### find

`crocks/Maybe/find`

```haskell
find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
```

Using a provided predicate function or a `Pred` datatype, `find` takes a
`Foldable` instance and executes for every value in the `Foldable`, skipping
empty indexes. `find` then returns the first value it finds that passes the
predicate. If found, `find` returns the value in a `Just`, otherwise a `Nothing`
is returned.

```javascript
import find from 'crocks/Maybe/find'
import Pred from 'crocks/Pred'
import isNumber from 'crocks/predicates/isNumber'

// isEven :: Number -> Boolean
const isEven =
  x => x % 2 === 0

// largeNumber :: Pred a
const largeNumber =
  Pred(isNumber)
    .concat(Pred(x => x > 100))

find(largeNumber, [ 10, '12', 150, 200, 2000 ])
//=> Just 150

find(largeNumber, [ 1, 2, 3, 4, 5 ])
//=> Nothing

find(isEven, [ 1, 2, 3, 4, 5 ])
//=> Just 2
```

#### prop

`crocks/Maybe/prop`

```haskell
prop :: (String | Integer) -> a -> Maybe b
```

If you want some safety around pulling a value out of an `Object` or `Array`
with a single key or index, you can always reach for `prop`. Well, as long
as you are working with non-nested data that is. Just tell `prop` either the key
or index you are interested in, and you will get back a function that will take
anything and return a `Just` with the wrapped value if the key/index is defined.
If the key/index is not defined, you will get back a `Nothing`.

```javascript
import composeK from 'crocks/helpers/composeK'
import prop from 'crocks/Maybe/prop'

// getValue :: a -> Maybe b
const getValue =
  prop('value')

// getHead :: a -> Maybe b
const getHead =
  prop(0)

// getFirstValue :: a -> Maybe b
const getFirstValue = composeK(
  getHead,
  getValue
)

getValue({ some: false })
//=> Nothing

getValue(undefined)
//=> Nothing

getValue({ value: 'correct' })
//=> Just "correct"

getFirstValue({ value: [] })
//=> Nothing

getFirstValue({ value: 84 })
//=> Nothing

getFirstValue(null)
//=> Nothing

getFirstValue({ value: [ 'a', 'b' ] })
//=> Just "a"
```

#### propPath

`crocks/Maybe/propPath`

```haskell
propPath :: Foldable f => f (String | Integer) -> a -> Maybe b
```

While [`prop`](#prop) is good for simple, single-level structures, there may
come a time when you have to work with nested POJOs or Arrays. When you run into
this situation, just pull in `propPath` and pass it a left-to-right traversal
path of keys, indices or a combination of both (gross...but possible). This will
kick you back a function that behaves just like [`prop`](#prop). You pass it
some data, and it will attempt to resolve your provided path. If the path is
valid, it will return the value residing there (`null` and `NaN` included!) in
a `Just`. But if at any point that path "breaks" it will give you back a `Nothing`.

```javascript
import composeK from 'crocks/helpers/composeK'
import isString from 'crocks/predicates/isString'
import propPath from 'crocks/Maybe/propPath'
import safe from 'crocks/Maybe/safe'

// getFirstValue :: a -> Maybe b
const getFirstValue =
  propPath([ 'value', 0 ])

// getStringFirst :: a -> Maybe String
const getStringFirst = composeK(
  safe(isString),
  getFirstValue
)

getFirstValue({ value: [] })
//=> Nothing

getFirstValue({ value: 84 })
//=> Nothing

getFirstValue(undefined)
//=> Nothing

getFirstValue({ value: [ 'a', 'b' ] })
//=> Just "a"

getStringFirst(false)
//=> Nothing

getStringFirst({ towel: true })
//=> Nothing

getStringFirst({ value: [ 0, 54 ] })
//=> Nothing

getStringFirst({ value: [ 'nice', 'jobb' ] })
//=> Just "nice"
```

#### safe

`crocks/Maybe/safe`

```haskell
safe :: ((b -> Boolean) | Pred) -> b -> Maybe a
```

When using a `Maybe`, it is a common practice to lift into a `Just` or a
`Nothing` depending on a condition on the value to be lifted.  It is so common
that it warrants a function, and that function is called `safe`. Provide a
predicate (a function that returns a Boolean) or a [`Pred`][pred] datatypea and the value
to be lifted. The value will be evaluated against the predicate, and will lift it into a `Just` if
true and a `Nothing` if false.

```javascript
import Pred from 'crocks/Pred'

import isArray from 'crocks/predicates/isArray'
import safe from 'crocks/Maybe/safe'

// length :: Array -> Number
const length =
  x => x.length

// lte2 :: Number -> Boolean
const lte2 =
  x => x <= 2

// isSmall :: Pred a
const isSmall =
  Pred(isArray)
    .concat(Pred(lte2).contramap(length))

safe(lte2, 87)
//=> Nothing

safe(lte2, 1)
//=> Just 1

safe(isArray, {})
//=> Nothing

safe(isArray, [ 1, 2, 3 ])
//=> Just [ 1, 2, 3 ]

safe(isSmall, [ 1, 2, 3 ])
//=> Nothing

safe(isSmall, { ar: [ 1, 2, 3 ] })
//=> Nothing

safe(isSmall, null)
//=> Nothing

safe(isSmall, [ 1, 2 ])
//=> Just [ 1, 2 ]
```

#### safeAfter

`crocks/Maybe/safeAfter`

```haskell
safeAfter :: ((b -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
```

Many times, you might want to lift the result of a function into a `Maybe` based
on some predicate. This may be because some parts of our code might return unsafe values for
further computations we may like to perform. Similar to [`safe`](#safe), you pass either a
[`Pred`][pred] or a predicate function, along with a unary function. `safeAfter` then gives
you a new  function, which when invoked evaluates the predicate against the result of executing
the unary function. This result is then lifted into a `Just` if the predicate evaluates
to `true`, or a `Nothing` if it returns `false`

```javascript
import Pred from 'crocks/Pred'
import curry from 'crocks/helpers/curry'
import isDefined from 'crocks/predicates/isDefined'
import isNumber from 'crocks/predicates/isNumber'
import safeAfter from 'crocks/Maybe/safeAfter'

// prop :: String -> Object -> a | undefined
const prop = curry(
  (key, x) => x[key]
)

// divide :: Number -> Number -> Number
const divide = curry(
  (x, y) => x / y
)

// safeDivide :: Number -> Number -> Maybe FiniteNumber
const safeDivide = curry(
  x => safeAfter(isFinite, divide(x))
)

// isValid :: Pred a
const isValid =
  Pred(isDefined)
    .concat(Pred(isNumber))

// safePropNumber :: String -> Object -> Maybe Number
const validProp = curry(
  key => safeAfter(isValid, prop(key))
)

divide(3, 0)
//=> Infinity

safeDivide(3, 0)
//=> Nothing

divide(3, 1)
//=> 3

safeDivide(3, 1)
//=> Just 3

prop('a', { b: 32 })
//=> undefined

prop('a', { a: 'thirty-two' })
//=> 'thirty-two'

prop('a', { a: 32 })
//=> 32

validProp('a', { a: 'thirty-two' })
//=> Nothing

validProp('a', { b: 32 })
//=> Nothing

validProp('a', { a: 32 })
//=> Just 32
```

#### safeLift

`crocks/Maybe/safeLift`

```haskell
safeLift :: ((c -> Boolean) | Pred) -> (a -> b) -> c -> Maybe b
```

While [`safe`](#safe) is used to lift a value into a `Maybe`, you can reach for
`safeLift` when you want to run a function in the safety of the `Maybe` context.
Just like [`safe`](#safe), you pass it either a [`Pred`][pred] or a predicate function
to determine if you get a `Just` or a `Nothing`, but then instead of a value,
you pass it a unary function. `safeLift` will then give you back a new function
that will first lift its argument into a `Maybe` and then maps your original
function over the result.

```javascript
import Pred from 'crocks/Pred'

import isNumber from 'crocks/predicates/isNumber'
import safeLift from 'crocks/Maybe/safeLift'

// doubleOf :: Number -> Number
const doubleOf =
  x => x * 2

// halfOf :: Number -> Number
const halfOf =
  x => x / 2

// gt100 :: Number -> Boolean
const gt100 =
  x => x > 100

// safeDouble :: a -> Maybe Number
const safeDouble =
  safeLift(isNumber, doubleOf)

// isLargeNumber :: Pred a
const isLargeNumber =
  Pred(isNumber)
    .concat(Pred(gt100))

// halfLarge :: a -> Maybe Number
const halfLarge =
  safeLift(isLargeNumber, halfOf)

safeDouble(null)
// Nothing

safeDouble('33')
// Nothing

safeDouble(33)
// Just 66

halfLarge('1000')
// Nothing

halfLarge(100)
// Nothing

halfLarge(false)
// Nothing

halfLarge(786)
// Just 383

halfLarge(100)
// Nothing

halfLarge(false)
// Nothing
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### eitherToMaybe

`crocks/Maybe/eitherToMaybe`

```haskell
eitherToMaybe :: Either b a -> Maybe a
eitherToMaybe :: (a -> Either c b) -> a -> Maybe b
```

Used to transform a given [`Either`][either] instance to a `Maybe`
instance, `eitherToMaybe` will turn a [`Right`][right] instance into
a [`Just`](#just) wrapping the original value contained in the [`Right`][right].
All [`Left`][left] instances will map to a [`Nothing`](#nothing), mapping the
originally contained value to a `Unit`. Values on the [`Left`][left] will be
lost and as such this transformation is considered lossy in that regard.

Like all `crocks` transformation functions, `eitherToMaybe` has two possible
signatures and will behave differently when passed either
an [`Either`][either] instance or a function that returns an instance
of [`Either`][either]. When passed the instance, a transformed `Maybe` is
returned. When passed an [`Either`][either] returning function, a function will
be returned that takes a given value and returns a `Maybe`.

```javascript
import Maybe from 'crocks/Maybe'

import Either from 'crocks/Either'

import eitherToMaybe from 'crocks/Maybe/eitherToMaybe'

import constant from 'crocks/combinators/constant'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Nothing, Just } = Maybe

const { Left, Right } = Either

// someNumber :: a -> Either String Number
const someNumber = ifElse(
  isNumber,
  Right,
  constant(Left('Nope'))
)

eitherToMaybe(Left(56))
//=> Nothing

eitherToMaybe(Right('correct'))
//=> Just "correct"

Just('ten')
  .chain(eitherToMaybe(someNumber))
//=> Nothing

Nothing()
  .chain(eitherToMaybe(someNumber))
//=> Nothing

Just(99)
  .chain(eitherToMaybe(someNumber))
//=> Just 99
```

#### firstToMaybe

`crocks/Maybe/firstToMaybe`

```haskell
firstToMaybe :: First a -> Maybe a
firstToMaybe :: (a -> First b) -> a -> Maybe b
```

Used to transform a given [`First`][first] instance to a `Maybe`
instance, `firstToMaybe` will turn a non-empty instance into
a [`Just`](#just) wrapping the original value contained within
the [`First`][first]. All empty instances will map to a [`Nothing`](#nothing).

Like all `crocks` transformation functions, `firstToMaybe` has two possible
signatures and will behave differently when passed either
a [`First`][first] instance or a function that returns an instance
of [`First`][first]. When passed the instance, a transformed `Maybe` is
returned. When passed a [`First`][first] returning function, a function will be
returned that takes a given value and returns a `Maybe`.

```javascript
import Maybe from 'crocks/Maybe'

import First from 'crocks/First'
import firstToMaybe from 'crocks/Maybe/firstToMaybe'

import mconcat from 'crocks/helpers/mconcat'

const { Nothing, Just } = Maybe

// firstValue :: [ a ] -> First a
const firstValue =
  mconcat(First)

firstToMaybe(First.empty())
//=> Nothing

firstToMaybe(First('winner'))
//=> Just "Winner"

Nothing()
  .chain(firstToMaybe(firstValue))
//=> Nothing

Just([])
  .chain(firstToMaybe(firstValue))
//=> Nothing

Just([ 'first', 'second', 'third' ])
  .chain(firstToMaybe(firstValue))
//=> Just "first"
```

#### lastToMaybe

`crocks/Maybe/lastToMaybe`

```haskell
lastToMaybe :: Last a -> Maybe a
lastToMaybe :: (a -> Last b) -> a -> Maybe b
```

Used to transform a given [`Last`][last] instance to a `Maybe` instance,
`lastToMaybe` will turn a non-empty instance into a [`Just`](#just) wrapping the
original value contained within the [`Last`][last]. All empty instances will map
to a [`Nothing`](#nothing).

Like all `crocks` transformation functions, `lastToMaybe` has two possible
signatures and will behave differently when passed either
a [`Last`][last] instance or a function that returns an instance
of [`Last`][last]. When passed the instance, a transformed `Maybe` is returned.
When passed a [`Last`][last] returning function, a function will be returned
that takes a given value and returns a `Maybe`.

```javascript
import Maybe from 'crocks/Maybe'

import Last from 'crocks/Last'
import lastToMaybe from 'crocks/Maybe/lastToMaybe'

import mconcat from 'crocks/helpers/mconcat'

const { Nothing, Just } = Maybe

// lastValue :: [ a ] -> Last a
const lastValue =
  mconcat(Last)

lastToMaybe(Last.empty())
//=> Nothing

lastToMaybe(Last('the end'))
//=> Just "the end"

Nothing()
  .chain(lastToMaybe(lastValue))
//=> Nothing

Just([])
  .chain(lastToMaybe(lastValue))
//=> Nothing

Just([ 'first', 'second', 'third' ])
  .chain(lastToMaybe(lastValue))
//=> Just "third"
```

#### resultToMaybe

`crocks/Maybe/resultToMaybe`

```haskell
resultToMaybe :: Result e a -> Maybe a
resultToMaybe :: (a -> Result e b) -> a -> Maybe b
```

Used to transform a given `Result` instance to a `Maybe`
instance, `resultToMaybe` will turn an `Ok` instance into a `Just` wrapping
the original value contained in the `Ok`. All `Err` instances will map to
a `Nothing`, mapping the originally contained value to a `Unit`. Values on the
`Err` will be lost and as such this transformation is considered lossy in
that regard.

Like all `crocks` transformation functions, `resultToMaybe` has two possible
signatures and will behave differently when passed either an `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `Maybe` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns a `Maybe`.

```javascript
import Maybe from 'crocks/Maybe'

import Result from 'crocks/Result'

import resultToMaybe from 'crocks/Maybe/resultToMaybe'

import identity from 'crocks/combinators/identity'
import tryCatch from 'crocks/Result/tryCatch'

const { Nothing, Just } = Maybe

const { Err, Ok } = Result

function datErrTho() {
  throw new Error('something amiss')
}

resultToMaybe(Err('this is bad'))
//=> Nothing

resultToMaybe(Ok('this is great'))
//=> Just "this is great"

Nothing()
  .chain(resultToMaybe(identity))
//=> Nothing

Just('so good')
  .chain(resultToMaybe(tryCatch(datErrTho)))
//=> Nothing

Just('so good')
  .chain(resultToMaybe(Ok))
//=> Just "so good"
```
</article>

[pred]: ./Pred.html
[either]: ./Either.html
[left]: ./Either.html#left
[right]: ./Either.html#right
[first]: ../monoids/First.html
[last]: ../monoids/Last.html
