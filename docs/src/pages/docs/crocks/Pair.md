---
title: "Pair"
description: "Canonical Product Type"
layout: "guide"
functions: ["branch", "fanout", "fst", "snd", "topairs", "writertopair"]
weight: 100
---

```haskell
Pair a b
```

`Pair` allows the ability to represent two distinct values of different types.
Much like how [`Either`][either] is known as canonical Sum Type and defines the basis for
all other Sum Types that ship with `crocks`, `Pair` is known as the canonical
Product Type and also at the heart of all Product Types in `crocks`.

As `Pair` is a `Bifunctor`, it can vary in each of the two types it represents.
When used as a normal `Functor`, `Pair` will always have a bias for the far
right or second value, matching the pattern of the other ADTs in `crocks`. When
mapped with a function, the function will only be applied to the second value,
and will leave the first value untouched.

`Pair` also provides the ability to use  [`ap`](#ap) and [`chain`](#chain), but in order to
combine the resulting instances in a predictable, repeatable fashion the first
values in the `Pair`s must be `Semigroup` instances of the same type. When
applied,  [`ap`](#ap) and [`chain`](#chain) will concatenate the `Semigroup`s providing the result
of the concatenation in the first position of the resulting `Pair`.

A helpful benefit of the `Bifunctor` aspects `Pair` allows for defining parallel
computations. There are many functions that ship with `crocks` that allow for
parallelization such as [`branch`](#branch), [`merge`](#merge) and
[`fanout`](#fanout). Using those helpers in conjunction with the ability to
[`bimap`](#bimap) functions over a given `Pair`s values.

```javascript
import Pair from 'crocks/Pair'
import Sum from 'crocks/Sum'
import bimap from 'crocks/pointfree/bimap'
import branch from 'crocks/Pair/branch'
import compose from 'crocks/helpers/compose'
import mreduce from 'crocks/helpers/mreduce'
import merge from 'crocks/pointfree/merge'

// negate :: a -> Boolean
const negate =
  x => !x

// inc :: Number -> Number
const inc =
  x => x + 1

// length :: Array -> Number
const length =
  x => x.length

// divide :: Number -> Number
const divide =
  (x, y) => x / y

Pair(76, false)
  .bimap(inc, negate)
//=> Pair(77, true)

// average :: [ Number ] -> Number
const average = compose(
  merge(divide),
  bimap(mreduce(Sum), length),
  branch
)

average([ 9, 77, 34 ])
//=> 40
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`,  `Bifunctor`, `Apply`, `Chain`,
`Traversable`, `Extend`

</article>

<article id="topic-construction">

## Construction

```haskell
Pair :: (a, b) -> Pair a b
```

In order to construct a `Pair`, two values of any type are required by the
constructor. The types of the arguments can, and often do, vary. None of the
constructors in crocks are curried by default, so both arguments must be
provided at the same time in order to construct the `Pair`.

Once both arguments are provided, the constructor will return a new `Pair`
instance with the first argument in the left portion and the second argument
in the right position.

```javascript
import Pair from 'crocks/Pair'

Pair(34, false)
//=> Pair Number Boolean

Pair(34, Pair(true, 'string'))
//=> Pair Number (Pair Boolean String)
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Pair a b ~> c -> Boolean
```

Used to compare the underlying values of two `Pair` instances for equality by
value. `equals` takes any given argument and returns `true` if the passed
arguments is a `Pair` with an underlying values both in the first and second are
equal to the underlying values in the first and second  of the `Maybe` the
method is being called on. If the passed argument is not a `Maybe` or the
underlying values are not equal, `equals` will return `false`.

```javascript
import Pair from 'crocks/Pair'
import equals from 'crocks/pointfree/equals'

Pair({ num: 33 }, 'string')
  .equals(Pair({ num: 33 }, 'string'))
//=> true

Pair({ num: 33 }, 'string')
  .equals(Pair({ num: 10 }, 'string'))
//=> false

Pair({ num: 33 }, 'string')
  .equals(Pair({ num: 33 }, 'different'))
//=> false

equals(Pair([ 1, 2 ], ''), [ 1, 2 ])
//=> false
```

#### concat

```haskell
Semigroup s, t => Pair s t ~> Pair s t -> Pair s t
```

When both underlying values of a given `Pair` are fixed to
a `Semigroup`, `concat` can be used to concatenate another `Pair` instance
with underlying `Semigroup`s of the same type and structure. Expecting
a `Maybe` wrapping a `Semigroup` of the same type, `concat` will give back a
new `Pair` instance wrapping the result of combining the
underlying `Semigroup` instances.

```javascript
import Pair from 'crocks/Pair'
import Maybe from 'crocks/Maybe'
import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import fanout from 'crocks/Pair/fanout'
import flip from 'crocks/combinators/flip'
import getProp from 'crocks/Maybe/getProp'
import map from 'crocks/pointfree/map'
import mapReduce from 'crocks/helpers/mapReduce'
import option from 'crocks/pointfree/option'

Pair(Sum(3), [ 3 ])
  .concat(Pair(Sum(10), [ 10 ]))
//=> Pair( Sum 13, [ 3, 10 ] )

// Person :: { name: String, age: Number }
// peeps :: [ Person ]
const peeps = [
  { name: 'Haskell', age: 82 },
  { name: 'Heinrich', age: 81 },
  { name: 'Maria', age: 93 }
]

// mapProp :: (String, (a -> b)) -> Object -> Maybe b
const mapProp = (key, fn) =>
  compose(map(fn), getProp(key))

// Combined :: Pair (Maybe [ String ]) (Maybe Sum)
// splitPerson :: Person -> Combined
const splitPerson = fanout(
  mapProp('name', x => [ x ]),
  mapProp('age', Sum)
)

// empty :: Combined
const empty =
  Pair(Maybe([]), Maybe(Sum.empty()))

// combine :: [ Person ] -> Combined
const combine = mapReduce(
  splitPerson,
  flip(concat),
  empty
)

combine(peeps)
  .bimap(option([]), option(Sum(0)))
//=> Pair( [ "Haskell", "Heinrich", "Maria" ], Sum 256 )
```

#### map

```haskell
Pair c a ~> (a -> b) -> Pair c b
```

Used to apply transformations to values to the second portion of a given `Pair`
instance. `map` takes a function that it will lift into the context of the
`Pair` and apply to it second value in the `Pair`, returning a new `Pair`
instance. The new instance will contain the result of mapping in the second,
leaving the value in the first untouched. If you need to map the first value,
[`bimap`](#bimap) can be used instead.

```javascript
import Pair from 'crocks/Pair'

import compose from 'crocks/helpers/compose'
import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'

// length :: String -> Number
const length =
  x => x.length

// add10 :: Number -> Number
const add10 =
  x => x + 10

// keyedLength :: Pair String String -> Object
const keyedLength =
  compose(merge(objOf), map(length))

Pair('number', 32)
  .map(add10)
//=> Pair("number", 42)

keyedLength(
  Pair('text', 'This is some text')
)
//=> { text: 17 }
```

#### bimap

```haskell
Pair a b ~> ((a -> c), (b -> d)) -> Pair c d
```

The types and values that make up a `Pair` can vary independently in both the
first and second portions of the `Pair`. While [`map`](#map) can be used to
apply these transformations, `bimap` allows for independent transformations
on both sides, in parallel.

`bimap` takes two mapping functions as its arguments. The first function is used
to map the first, while the second maps the second. `Pair` only provides a
means to map the second's value exclusively using [`map`](#map). If the need
arises to map the first portion exclusively, use `bimap` passing the mapping
function to the first argument and an [`identity`][identity] to the second.

```javascript
import Pair from 'crocks/Pair'
import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import bimap from 'crocks/pointfree/bimap'
import branch from 'crocks/Pair/branch'
import identity from 'crocks/combinators/identity'
import merge from 'crocks/pointfree/merge'
import mreduce from 'crocks/helpers/mreduce'

// add10 :: Number -> Number
const add10 =
  x => x + 10

// divide :: (Number, Number) -> Number
const divide =
  (x, y) => x / y

// length :: [ Number ] -> Number
const length =
  x => x.length

// average :: [ Number ] -> Number
const average = compose(
  merge(divide),
  bimap(mreduce(Sum), length),
  branch
)

Pair(35, 'number')
  .bimap(add10, identity)
//=> Pair( 45, 'number' )

average([ 2, 3, 4 ])
//=> 3
```

#### ap

```haskell
Semigroup s => Pair s (a -> b) ~> Pair s a -> Pair s b
```

Short for apply, `ap` is used to apply a `Pair` instance containing a value on
its second portion to another `Pair` instance that contains a function in its
second portion. The result of this application provides a new `Pair` instance
containing the result in the second portion. `ap` requires that it is called on
an instance that wraps a curried polyadic function in the second.

An additional constraint when using `ap` is that the `Pair` must contain a
`Semigroup` instance in its first. This is required for both the `Pair` with
the function and the `Pair` with the value to be applied. With both `Semigroups`
being of the same type.

```javascript
import Pair from 'crocks/Pair'
import liftA2 from 'crocks/helpers/liftA2'

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// NumberRec :: Pair [ Number ] Number

// twentyThree :: NumberRec
const twentyThree =
  Pair([ 23 ], 23)

// seventySeven :: NumberRec
const seventySeven =
  Pair([ 77 ], 77)

// combine :: NumberRec -> NumberRec -> NumberRec
const combine =
  liftA2(add)

twentyThree
  .map(add)
  .ap(seventySeven)
// Pair( [ 23, 77 ], 100 )

combine(twentyThree, seventySeven)
// Pair( [ 23, 77 ], 100 )
```

#### chain

```haskell
Semigroup s => Pair s a ~> (a -> Pair s b) -> Pair s b
```

Combining a sequential series of transformations that allows for custom
accumulation in addition to transforming a value. `chain` requires
a `Pair` returning function that contains a `Semigroup` in its first position.
An additional requirement, is that instances of the same `Semigroup` must
occupy the first position of the source `Pair` and the `Pair` returned by the
function.

```javascript
import Pair from 'crocks/Pair'

import setProp from 'crocks/helpers/setProp'
import omit from 'crocks/helpers/omit'

// addTmp :: (String, a, Object) -> Pair [ String ] Object
const addTmp = (key, value, x) =>
  Pair([ key ], setProp(key, value, x))

// add :: Object -> Pair [ String ] Object
const add = data => {
  const { a, b } = data
  return addTmp('sum', a + b, data)
}

// multiply :: Object -> Pair [ String ] Object
const multiply = data => {
  const { a, b } = data
  return addTmp('product', a * b, data)
}

// calc :: Object -> Object
const calc = data => {
  const { product, sum } = data
  return setProp('result', product - sum, data)
}

// flow :: Object -> Object
const flow = x =>
  Pair([], x)
    .chain(add)
    .chain(multiply)
    .map(calc)
    .merge(omit)

flow({ a: 34, b: 76 })
//=> { a: 34, b: 76, result: 2474 }

flow({ a: 10, b: 5 })
//=> { a: 10, b: 5, result: 35 }
```

#### sequence

```haskell
Apply f => Pair a (f b) ~> (c -> f c) -> f (Pair a b)
Applicative f => Pair a (f b) ~> TypeRep f -> f (Pair a b)
```

When an instance of `Pair` wraps an `Apply` instance in its second position,
`sequence` can be used to swap the type sequence. `sequence` requires either an
`Applicative TypeRep` or an `Apply` returning function is provided for its
argument.

While it is not a requirement that the first position be occupied by a
`Semigroup`, in having an instance there sequencing back on a data structure
with multiple items can allow for accumulation then sequencing back.

`sequence` can be derived from [`traverse`](#traverse) by passing it an
[`identity`][identity] function (`x => x`).

```javascript
import Pair from 'crocks/Pair'
import Sum from 'crocks/Sum'

import bimap from 'crocks/pointfree/bimap'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import flip from 'crocks/combinators/flip'
import mapReduce from 'crocks/helpers/mapReduce'
import sequence from 'crocks/pointfree/sequence'

// pair :: Pair Number [ String ]
const pair =
  Pair(1, [ 'a', 'b', 'c' ])

// empty :: () -> Pair Sum String
const empty =
  () => Pair(Sum.empty(), '')

// seqArray :: Traversable t => t [ a ] -> [ t a ]
const seqArray =
  sequence(Array)

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// combine :: [ Pair Number String ] -> Pair Sum String
const combine = mapReduce(
  bimap(Sum, toUpper),
  flip(concat),
  empty()
)

// flow :: Pair Number [ String ] -> Pair Sum String
const flow =
  compose(combine, seqArray)

seqArray(pair)
//=> [ Pair(1, "a"), Pair(1, "b"), Pair(1, "c") ]

flow(pair)
//=> Pair(Sum 3, "ABC")
```

#### traverse

```haskell
Apply f => Pair a b ~> ((d -> f d), (b -> f c)) -> f (Pair a c)
Applicative f => Pair a b ~> (TypeRep f, (b -> f c)) -> f (Pair a c)
```

Used to apply the "effect" of an `Apply` to a value in the second position of
a `Pair`, `traverse` combines both the "effects" of the `Apply` and the `Pair`
by returning a new instance of the `Apply`, wrapping the result of the
`Apply`s "effect" on the value in the second position of the `Pair`.

`traverse` requires either an `Applicative TypeRep` or an `Apply` returning
function as its first argument and a function that is used to apply the "effect"
of the target `Apply` to the value in the second position of the `Pair`. The
"effect" will only be applied to second value and leaves the first value
untouched. Both arguments must return an instance of the target `Apply`.

```javascript
import Maybe from 'crocks/Maybe'
import Pair from 'crocks/Pair'

import identity from 'crocks/combinators/identity'
import safe from 'crocks/Maybe/safe'
import traverse from 'crocks/pointfree/traverse'

const { Just, Nothing } = Maybe

// isOdd :: Integer -> Boolean
const isOdd =
  x => !!(x % 2)

// safeOdd :: Traversable t => t Integer -> Maybe (t Integer)
const safeOdd =
  traverse(Maybe, safe(isOdd))

// seqMaybe :: Traversable t => t (Maybe a) -> Maybe (t a)
const seqMaybe =
  traverse(Maybe.of, identity)

// odd :: Pair [ Number ] Integer
const odd =
  Pair([ 10 ], 23)

// even :: Pair String  Integer
const even =
  Pair('nope', 42)

safeOdd(odd)
//=> Just Pair( [ 10 ], 23 )

safeOdd(even)
//=> Nothing

seqMaybe(Pair(true, Just('good')))
//=> Just Pair( true, "good" )

seqMaybe(Pair(false, Nothing()))
//=> Nothing
```

#### extend

```haskell
Pair a b ~> (Pair a b -> c) -> Pair a c
```

Used map the second position of a given `Pair` instance by taking the entire
`Pair` into consideration. `extend` takes a function the receives a `Pair` as
its input and returns a new `Pair` with the result of that function in the
second position, while leaving the value in the first position untouched.

```javascript
import Pair from 'crocks/Pair'

import extend from 'crocks/pointfree/extend'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'

// name :: Pair String String
const name =
  Pair('name', 'Thomas')

// mergeObj :: Pair String a -> Object
const mergeObj =
  merge(objOf)

// makeObj :: Pair String a -> Pair String Object
const makeObj =
  extend(mergeObj)

makeObj(name)
//=> Pair("name", { name: "Thomas" })
```

#### swap

```haskell
Pair a b ~> ((a -> c), (b -> d)) -> Pair d c
```

Used to map the value of a `Pair`s first position into the second position and
the second position into the first, `swap` takes two functions as its arguments.
The first function is used to map the value in the first position to the second,
while the second maps the second into the first. If no mapping is required on
either side, then [`identity`][identity] functions can be used in one or both
arguments.

```javascript
import Pair from 'crocks/Pair'

import identity from 'crocks/combinators/identity'
import swap from 'crocks/pointfree/swap'

// toString :: a -> String
const toString =
  x => x.toString()

// swapMap :: Pair a String -> Pair Number String
const swapMap =
  swap(toString, parseInt)

// m :: Pair Number String
const m =
  Pair(76, '105')

m.swap(identity, identity)
//=> Pair("105", 76)

swapMap(m)
//=> Pair(105, "76")
```

#### fst

```haskell
Pair a b ~> () -> a
```

`fst` is one of two projection methods used to extract the values contained in
a given `Pair` instance. `fst` takes nothing as its input and will unwrap and
provide the value in the first position, throwing away the value in the second.
[`snd`](#snd) is the other projection function provided and is used to extract
the value in the second position.

```javascript
import Pair from 'crocks/Pair'

Pair('left', 'right')
  .fst()
//=> "left"
```

#### snd

```haskell
Pair a b ~> () -> b
```

`snd` is one of two projection methods used to extract the values contained in
a given `Pair` instance. `snd` takes nothing as its input and will unwrap and
provide the value in the second position, throwing away the value in the first.
[`fst`](#fst) is the other projection function provided and is used to extract
the value in the first position.

```javascript
import Pair from 'crocks/Pair'

Pair('left', 'right')
  .snd()
//=> "right"
```

#### toArray

```haskell
Pair a b ~> () -> [ a, b ]
```

While both [`fst`](#fst) and [`snd`](#snd) can be used to extract specific
values out of the structure of `Pair`, `toArray` extracts values but
maintains the structure. Taking nothing as its input, `toArray` will return an
`Array` of two values. The first value in the `Pair` will occupy the [0] index,
while the [1] index will house the second.

```javascript
import Pair from 'crocks/Pair'
import compose from 'crocks/helpers/compose'

// toArray :: Pair a b -> [ a, b ]
const toArray =
  x => x.toArray()

// toObject :: [ a, b ] -> Object
const toObject =
  ([ left, right ]) => ({ left, right })

// pairToObject :: Pair a b -> Object
const pairToObject =
  compose(toObject, toArray)

// m :: Pair String Number
const m =
  Pair('a', 1)

m.toArray()
//=> [ 'a', 1 ]

pairToObject(m)
//=> { left: 'a', right: 1 }
```

#### merge

```haskell
Pair a b ~> ((a, b) -> c) -> c
```

Acting as a means to fold a given `Pair` over a binary operation, `merge` takes
a binary function as its sole argument. Using the function, `merge` will unwrap
each of its values and apply them to the function in order from first to second.
The result of the provided function is then provided as the overall result
for `merge`.

This method comes in handy when using a `Pair` as a means to run parallel
computations and combine their results into a final answer. Typically this
method works hand in hand with the either the [`branch`](#branch) or
[`fanout`](#fanout) helper functions.

```javascript
import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import fanout from 'crocks/Pair/fanout'
import merge from 'crocks/pointfree/merge'
import mreduce from 'crocks/helpers/mreduce'

// length :: [ a ] -> Integer
const length =
  x => x.length

// divide :: (Number, Number) -> Number
const divide =
  (x, y) => x / y

// average :: [ Number ] -> Number
const average = compose(
  merge(divide),
  fanout(mreduce(Sum), length)
)

// nums :: [ Number ]
const nums =
  [ 23, 96, 90, 4, 21 ]

average(nums)
// 46.8
```

</article>

<article id="topic-helpers">

## Helper Functions

#### branch

`crocks/Pair/branch`

```haskell
branch :: a -> Pair a a
```

Typically the starting point for handling parallel computations on a single
value, `branch` takes a single value of any type as its only argument. `branch`
then returns a `Pair` with the reference or value in both the first and second
positions.

Using `branch` can simplify how computations that depend on the same value are
constructed and encoded by removing the need to keep the original value in some
state that needs to be passed from function to function.

```javascript
import assign from 'crocks/helpers/assign'
import bimap from 'crocks/pointfree/bimap'
import branch from 'crocks/Pair/branch'
import compose from 'crocks/helpers/compose'
import curry from 'crocks/helpers/curry'
import objOf from 'crocks/helpers/objOf'
import merge from 'crocks/pointfree/merge'

// add10 :: Number -> Number
const add10 =
  x => x + 10

// applyChange :: (a -> b) -> a -> Object
const applyChange = fn =>
  compose(objOf('current'), fn)

// createUndo :: (a -> b) -> a -> Object
const createUndo = curry(fn =>
  compose(
    merge(assign),
    bimap(objOf('orig'), applyChange(fn)),
    branch
  )
)

// applyAdd10 :: Number -> Object
const applyAdd10 =
  createUndo(add10)

applyAdd10(5)
// { current: 15, orig: 5 }
```

#### fanout

`crocks/Pair/fanout`

```haskell
fanout :: (a -> b) -> (a -> c) -> (a -> Pair b c)
fanout :: Arrow a b -> Arrow a c -> Arrow a (Pair b c)
fanout :: Monad m => Star a (m b) -> Star a (m c) -> Star a (m (Pair b c))
```

There are may times that you need to keep some running or persistent state while
performing a given computation. A common way to do this is to take the input to
the computation and branch it into a `Pair` and perform different operations on
each version of the input. This is such a common pattern that it warrants the
`fanout` function to take care of the initial split and mapping. Just provide a
pair of either simple functions or a pair of one of the computation types
(`Arrow` or `Star`). You will get back something of the same type that is
configured to split it's input into a pair and than apply the first Function/ADT
to the first portion of the underlying `Pair` and the second on the second.

```javascript
import compose from 'crocks/helpers/compose'
import fanout from 'crocks/Pair/fanout'
import getProp from 'crocks/Maybe/getProp'
import liftA2 from 'crocks/helpers/liftA2'
import map from 'crocks/pointfree/map'
import Maybe from 'crocks/Maybe'
import merge from 'crocks/Pair/merge'
import sequence from 'crocks/pointfree/sequence'

// Person :: { first: String, last: String }
// people :: [Person]
const people = [
  { first: 'Ziggy', last: 'Stardust' },
  { first: 'Lizard', last: 'King' }
]

// concat :: String -> String -> String
const concat = a => b => `${a} ${b}`

// join :: String -> [a] -> String
const join = sep => arr => arr.join(sep)

// getName :: Person -> String
const getName = compose(
  merge(liftA2(concat)),
  fanout(getProp('first'), getProp('last'))
)

// getPersons :: [Person] -> String
const getPersons = compose(
  map(join(', ')),
  sequence(Maybe),
  map(getName)
)

getPersons(people)
//=> Just "Ziggy Stardust, Lizard King"
```

#### toPairs

`crocks/Pair/toPairs`

```haskell
toPairs :: Object -> List (Pair String a)
```

When dealing with `Object`s, sometimes it makes more sense to work in a
`Foldable` structure like an `Array` of key-value `Pair`s. `toPairs` provides a
means to take an object and give you back an `Array` of `Pairs` that have a
`String` that represents the key in the `fst` and the value for that key in the
`snd`. The primitive values are copied, while non-primitive values are
references. Like most of the `Object` functions in `crocks`, any keys with
`undefined` values will be omitted from the result. `crocks` provides an inverse
to this function named [`fromPairs`][frompairs].

```javascript
import compose from 'crocks/helpers/compose'
import map from 'crocks/pointfree/map'
import merge from 'crocks/pointfree/merge'
import toPairs from 'crocks/Pair/toPairs'

// record :: Object
const record = {
  firstName: 'Joey',
  lastName: 'Fella',
  age: 34
}

// joinField :: (String, a) -> String
const joinField = (key, value) =>
  `${key}:${value}`

// joinRecord :: Array String -> String
const joinRecord = arr =>
  arr.join('|')

// buildRecord :: Object -> String
const buildRecord = compose(
  joinRecord,
  map(merge(joinField)),
  toPairs
)

buildRecord(record)
//=> "firstName:Joey|lastName:Fella|age:34"
```

</article>

<article id="topic-pointfree">

## Pointfree Functions

#### fst (pointfree)

`crocks/Pair/fst`

```haskell
fst :: Pair a b -> a
```

The `fst` pointfree function is used extract the leftmost value of a `Pair` by
invoking the [`fst`](#fst) method on a given instance, returning the result.
`fst` takes a `Pair` as its only argument and returns the value wrapped in the
leftmost portion of the provided `Pair`.

```javascript
import Pair from 'crocks/Pair'

import flip from 'crocks/combinators/flip'
import fst from 'crocks/Pair/fst'
import ifElse from 'crocks/logic/ifElse'
import merge from 'crocks/pointfree/merge'
import snd from 'crocks/Pair/snd'

// lte :: (Number, Number) -> Boolean
const lte =
  (y, x) => x <= y

// min :: Pair Number Number -> Number
const min = ifElse(
  merge(flip(lte)),
  fst,
  snd
)

min(Pair(1, 2))
//=> 1

min(Pair(45, 22))
//=> 22

min(Pair(100, 100))
//=> 100
```

#### snd (pointfree)

`crocks/Pair/snd`

```haskell
snd :: Pair a b -> b
```

The `snd` pointfree function is used extract the rightmost value of a `Pair` by
invoking the [`snd`](#snd) method on a given instance, returning the result.
`snd` takes a `Pair` as its only argument and returns the value wrapped in the
rightmost portion of the provided `Pair`.

```javascript
import Pair from 'crocks/Pair'
import Unit from 'crocks/Unit'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import map from 'crocks/pointfree/map'
import snd from 'crocks/Pair/snd'

// Box :: a -> Pair () a
const Box =
  x => Pair(Unit(), x)

// unbox :: Pair a b -> b
const unbox =
  snd

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// doubleBoxed :: Number -> Pair () Number
const doubleBoxed =
  m => Box(m * 2)

// flow :: Number -> Number
const flow = compose(
  unbox,
  chain(doubleBoxed),
  map(add(10)),
  Box
)

flow(10)
//=> 40
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### writerToPair

`crocks/Pair/writerToPair`

```haskell
writerToPair :: Monoid m => Writer m a -> Pair m a
writerToPair :: Monoid m => (a -> Writer m b) -> a -> Pair m b
```

Used to transform a `Writer` instance to a `Pair` instance or
flatten a `Pair` of `Writer` into an `Pair` when chained,
`writerToPair` will take a given `Writer` and provide a new `Pair` with
the `log` portion of the `Writer` in the first position and the `resultant`
in the second.

Like all `crocks` transformation functions, `writerToPair` has two possible
signatures and will behave differently when passed either a `Writer` instance
or a function that returns an instance of `Writer`. When passed the instance,
a `Pair` instance is returned. When passed a `Writer` returning function,
a function will be returned that takes a given value and returns an `Pair`.

```javascript
import Pair from 'crocks/Pair'
import Sum from 'crocks/Sum'
import Writer from 'crocks/Writer'
import fanout from 'crocks/Pair/fanout'

import writerToPair from 'crocks/Pair/writerToPair'

// SumWriter :: Writer Sum a
const SumWriter =
  Writer(Sum)

// appendItem :: a -> [ a ] -> SumWriter [ a ]
const appendItem = item => xs =>
  SumWriter(1, xs.concat([ item ]))

SumWriter(0, [])
  .chain(appendItem('one'))
  .chain(appendItem('two'))
  .chain(appendItem('three'))
//=> Writer (Sum 3) [ "one", "two", "three" ]

writerToPair(SumWriter(2, 'result'))
//=> Pair(Sum 2, 'result')

Pair(Sum.empty(), [])
  .chain(writerToPair(appendItem('one')))
  .chain(writerToPair(appendItem('two')))
  .chain(writerToPair(appendItem('three')))
//=> Pair(Sum 3, [ "one", "two", "three"])

fanout(Sum, x => appendItem(x)([ x ]), 1)
  .chain(writerToPair)
```

</article>

[frompairs]: ../functions/helpers.html#frompairs
[identity]: ../functions/combinators.html#identity
[either]: ../crocks/Either.html
