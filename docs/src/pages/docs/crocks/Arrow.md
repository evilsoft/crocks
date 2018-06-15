---
title: "Arrow"
description: "Arrow Crock"
layout: "guide"
weight: 10
---

```haskell
Arrow a b
```

`Arrow` is a `Profunctor` that lifts a function of type `a -> b` and allows for
lazy execution of the function. `Arrow` can be considered a `Strong Profunctor`
if the underlying data running through the `Arrow` is a `Pair`, typically in the
form of `Arrow (Pair a c) (Pair b d)`.

This will allow you to split execution into two distinct paths, applying `Arrow`
to a specific path. The parameters of `Arrow` represent the function that it
wraps, with the input being on the left, and the output on the right. When an
`Arrow` wraps an endomorphism, the signature typically represents both the input
and output.

```javascript
import Arrow from 'crocks/Arrow'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isString from 'crocks/predicates/isString'
import option from 'crocks/pointfree/option'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

// arrUpper :: Arrow String
const arrUpper =
  Arrow(str => str.toUpperCase())

arrUpper
  .runWith('nice')
//=> 'NICE'

// getName :: a -> String
const getName = compose(
  option('no name'),
  chain(safe(isString)),
  prop('name')
)

// arrUpperName :: Arrow a String
const arrUpperName =
  arrUpper
    .contramap(getName)

arrUpperName
  .runWith({ name: 'joey' })
//=> 'JOEY'

arrUpperName
  .runWith({ age: 23 })
//=> 'NO NAME'

arrUpperName
  .runWith({ name: false })
//=> 'NO NAME'
```

<article id="topic-implements">

## Implements
`Semigroupoid`, `Category`, `Functor`, `Contravariant`, `Profunctor`

</article>

<article id="topic-construction">

## Construction

```haskell
Arrow :: (a -> b) -> Arrow a b
```

An `Arrow` is constructed with a unary function from a type `(a -> b)`. The
input, or domain, of the function is the left parameter in the type signature
and the output, or co-domain, of the function represents the right.

```javascript
import Arrow from 'crocks/Arrow'

import compose from 'crocks/helpers/compose'
import option from 'crocks/pointfree/option'
import prop from 'crocks/Maybe/prop'

// length :: a -> Integer
const length = compose(
  option(0),
  prop('length')
)

Arrow(length)
//=> Arrow a Integer
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### id

```haskell
Arrow.id :: () -> Arrow a
```

`id` provides the identity for the `Arrow` in that when it is composed to either
the left or right side of a given function, it will essentially result in a
morphism that is, for all intents and purposes, the given function. For `Arrow`,
`id` is the simple `identity` function that echoes it's given argument
(`x => x`). As a convenience, `id` is also available on the `Arrow` instance.

```javascript
import Arrow from 'crocks/Arrow'

// arrId :: Arrow a
const id = Arrow.id()

// arrow :: Arrow a String
const arrow =
  Arrow(x => x.toString())

// left :: Arrow a String
const left =
  id.compose(arrow)

// right :: Arrow a String
const right =
  arrow.compose(id)

right.runWith(12)
//=> '12'

left.runWith(12)
//=> '12'
```

</article>

<article id="topic-instance">

## Instance Methods

#### both

```haskell
Pair p => Arrow a b ~> () -> Arrow (p a a) (p b b)
```

`both` allows for the mode of a given `Arrow` to switch to a manner that applies
itself to both slots of a `Pair` that is passed through the `Arrow`. As noted in
the type signature, `both` will give back an `Arrow` has a new signature that
utilizes a `Pair` on both sides.

```javascript
import Arrow from 'crocks/Arrow'
import Pair from 'crocks/Pair'

import merge from 'crocks/pointfree/merge'

// double :: Number -> Number
const double =
  x => x * 2

// add :: (Number, Number) -> Number
const add =
  (x, y) => x + y

// arrDouble :: Arrow Number
const arrDouble =
  Arrow(double)

// arrDoubleAndAdd :: Arrow (Pair Number Number) Number
const arrDoubleAndAdd =
  arrDouble
    .both()
    .map(merge(add))

arrDouble
  .runWith(200)
//=> 400

arrDoubleAndAdd
  .runWith(Pair(200, 10))
//=> 420
```

#### compose

```haskell
Arrow a b ~> Arrow b c -> Arrow a c
```
`compose` allows you to compose (2) `Arrow`s together, resulting in a new
`Arrow` that is the result of the composition.

```javascript
import Arrow from 'crocks/Arrow'

import filter from 'crocks/pointfree/filter'
import map from 'crocks/pointfree/map'

// arrFilterEven :: Arrow [ Number ]
const arrFilterEven =
  Arrow(filter(x => !(x % 2)))

// arrDoubleNumbers :: Arrow [ Number ]
const arrDoubleNumbers =
  Arrow(map(x => x * 2))

// arrLength :: Arrow [ a ] -> Number
const arrLength =
  Arrow(x => x.length)

// arrDoubleEven :: Arrow [ Number ]
const arrDoubleEven =
  arrFilterEven
    .compose(arrDoubleNumbers)

// arrEvenCount :: Arrow [ Number ] Number
const arrEvenCount =
  arrFilterEven
    .compose(arrLength)

// data :: [ Number ]
const data =
  [ 12, 2, 36, 35 ]

arrDoubleEven
  .runWith(data)
//=> [ 24, 4, 72 ]

arrEvenCount
  .runWith(data)
//=> 3
```

#### contramap

```haskell
Arrow a b ~> (c -> a) -> Arrow c b
```

When using `contramap` on an `Arrow`, a function can be lifted that will map a
given type into the type required for the original `Arrow`'s input. This allows
for "adaption" of given `Arrow`'s input for better reuse. The resulting type of
the lifted function must match the input type of the `Arrow`.

```javascript
import Arrow from 'crocks/Arrow'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'
import option from 'crocks/pointfree/option'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

// getValue :: (String, Number) -> a -> Number
const getValue = (key, def) => compose(
  option(def),
  chain(safe(isNumber)),
  prop(key)
)

// arrAdd10 :: Arrow Number
const arrAdd10 =
  Arrow(x => x + 10)

// arrAdd10Value :: Arrow Object Number
const arrAdd10Value =
  arrAdd10
    .contramap(getValue('value', 0))

arrAdd10
  .runWith(23)
//=> 33

arrAdd10Value
  .runWith({ value: 23 })
//=> 33

arrAdd10Value
  .runWith({ value: '23' })
//=> 10

arrAdd10Value
  .runWith({ num: '23' })
//=> 10
```

#### first

```haskell
Pair p => Arrow a b ~> () -> Arrow (p a c) (p b c)
```

When calling `first` on an `Arrow`, a new `Arrow` is returned that will expect
a `Pair` with the original input type in the first slot of the `Pair`. When run,
the `Arrow` will only be applied to the first slot in the `Pair`, leaving
the second slot untouched.

```javascript
import Arrow from 'crocks/Arrow'
import branch from 'crocks/Pair/branch'

// arrToUpper :: Arrow String
const arrToUpper =
  Arrow(x => x.toUpperCase())

arrToUpper
  .runWith('burrito bounce')
//=> 'BURRITO BOUNCE'

// join :: Pair String -> Object
const join = p => ({
  original: p.snd(),
  result: p.fst()
})

// flow :: Arrow String Object
const flow =
  arrToUpper
    .first()
    .promap(branch, join)

flow
  .runWith('taco time')
//=> { original: 'taco time', result: 'TACO TIME' }
```

#### map

```haskell
Arrow a b ~> (b -> c) -> Arrow a c
```

`map` allows a function to be lifted that will map the right side of the
`Arrow`. Where [`contramap`](#contramap) is used to map the input, `map` maps the result
of the `Arrow`, allowing the result to be "adapted" or modified. The input type
to the lifted function must match the result the `Arrow`.

```javascript
import Arrow from 'crocks/Arrow'

import B from 'crocks/combinators/composeB'

// arrFullScale :: Arrow Number
const arrFullScale =
  Arrow(x => 20 * Math.log10(Math.abs(x)))

arrFullScale
  .runWith(-0.35)
//=> -9.118639112994488

// round :: Number -> Number
const round =
  x => Math.floor(x * 100) / 100

// stringRep :: Number -> String
const stringRep =
  x => `${x} dBFS`

// Arrow :: Number String
const arrStringFS =
  arrFullScale
    .map(B(stringRep, round))

arrStringFS
  .runWith(0.35)
//=> '-9.12 dbFS'
```

#### promap

```haskell
Arrow a b ~> ((c -> a), (b -> d)) -> Arrow c d
```

`promap` can be used to adapt BOTH ends of an `Arrow` allowing for existing
`Arrow`s to be reused in places in a flow where the types do not line up. It
combines both [`map`](#map) and [`contramap`](#contramap) into one operation.
Just pass the function for [`contramap`](#contramap) as the first argument
and the function [`map`](#map) as the second.

```javascript
import Arrow from 'crocks/Arrow'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isString from 'crocks/predicates/isString'
import objOf from 'crocks/helpers/objOf'
import option from 'crocks/pointfree/option'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

// upperFirst :: String -> String
const upperFirst = x =>
  x.charAt(0)
    .toUpperCase()
    .concat(x.slice(1).toLowerCase())

// arrTitleize :: Arrow String
const arrTitleize =
  Arrow(x => x.split(' ').map(upperFirst).join(' '))

arrTitleize
  .runWith('tHis is siLLy')
//=> 'This Is Silly'

// stringProp :: String -> Object -> String
const stringProp = key => compose(
  option(''),
  chain(safe(isString)),
  prop(key)
)

// arrTitleObject :: Arrow Object
const arrTitleObject =
  arrTitleize
    .promap(stringProp('title'), objOf('title'))

arrTitleObject
  .runWith({ title: 'SaY wHaT!?!' })
// { title: 'Say What!?!' }

arrTitleObject
  .runWith({ title: true })
// { title: '' }
```

#### runWith

```haskell
Arrow a b ~> a -> b
```

`Arrow`s are lazy to make combining and extending them easy. Once you have your
final computation built out and you are ready to execute it, all you have to
do is call `runWith` on it, passing in the argument you what to run it with.

```javascript
import Arrow from 'crocks/Arrow'
import Sum from 'crocks/Sum'

import branch from 'crocks/Pair/branch'
import merge from 'crocks/pointfree/merge'
import mreduce from 'crocks/helpers/mreduce'

// data :: [ Number ]
const data =
  [ 35, 60, 22, 100 ]

// arrLength :: Arrow [ a ] Number
const arrLength =
  Arrow(x => x.length)

arrLength
  .runWith(data)
//=> 4

// arrSum :: Arrow [ Number ] Number
const arrSum =
  Arrow(mreduce(Sum))

arrSum
  .runWith(data)
//=> 217

// arrAvgList :: Arrow [ Number ] Number
const arrAvgList =
  arrSum.first()
    .compose(arrLength.second())
    .promap(branch, merge((x, y) => x / y))

arrAvgList
  .runWith(data)
//=> 54.25
```

#### second

```haskell
Pair p => Arrow a b ~> () -> Arrow (p c a) (p c b)
```

Used to apply a given `Arrow` over the second slot of a `Pair`, leaving the
first slot untouched. The input to the `Arrow` must match the expected type on
the second slot of the incoming `Pair`.

```javascript
import Arrow from 'crocks/Arrow'

import assign from 'crocks/helpers/assign'
import branch from 'crocks/Pair/branch'
import merge from 'crocks/pointfree/merge'
import objOf from 'crocks/helpers/objOf'

// names :: Object
const names = {
  first: 'Joey',
  last: 'Fella'
}

// arrFull :: Arrow Object
const arrFull =
  Arrow(({ first, last }) => `${first} ${last}`)
    .map(objOf('full'))
//=> { full: 'Joey Fella' }

// arrAddFull :: Arrow Object
const arrAddFull =
  arrFull
    .second()
    .promap(branch, merge(assign))

arrAddFull
  .runWith(names)
//=> { full: 'Joey Fella', first: 'Joey', last: 'Fella' }
```

</article>
