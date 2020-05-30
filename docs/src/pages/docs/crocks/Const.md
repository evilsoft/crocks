---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 30
---

```haskell
Const c a
```

Commonly known as the Delta (Δ) Functor, `Const` is a Product type the whose
underlying left-most value is fixed to the value it was originally constructed
with. This ensures that a desired value is immutable. While its right portion
can still be mapped over, when observed, all information on the right will be
discarded, leaving only the initial fixed value `c`.

When `c` is a `Semigroup` instance, `Const` acts like a `Semigroup` and can
combine two instances using [`concat`](#concat). As a special bonus, is also
acts as an `Apply` as [`ap`](#ap) can be derived from [`concat`](#concat).

When `c` is a `Monoid` instance, `Const` acts like a `Monoid` and provides
a valid [`empty`](#empty) function on both the Constructor and Instance. Like,
the `Semigroup` having the ability to be used as an `Apply`, `Const` can derive
an [`of`](#of) function and can be used like an `Applicative`.

```javascript
import Const from '/crocks/Const'
import Identity from 'crocks/Identity'
import Pair from 'crocks/Pair'
import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import curry from 'crocks/helpers/curry'
import map from 'crocks/pointfree/map'
import traverse from 'crocks/pointfree/traverse'

// StrConst :: String -> Const String a
const StrConst =
  Const(String)

StrConst('Hello World')
//=> Const(String) "Hello World"

// add :: Number -> Number -> Number
const add =
  x => y => x + y

Pair(Identity(30), StrConst('always, forever'))
  .bimap(map(add(4)), map(add(4)))
//=> Pair(Identity 34, Const(String) "always, forever")

// ArrayConst :: [ b ] -> Const [ b ] a
const ArrayConst =
  Const(Array)

ArrayConst([ 'a' ])
  .map(add)
  .ap(ArrayConst([ 'b' ]))
//=> Const(Array) [ "a", "b" ]

// foldMap :: Monoid m, Foldable f => M -> (a -> m) -> f a -> m
const foldMap = curry(
  (T, fn, xs) => {
    const Rep = Const(T)
    return traverse(Rep, compose(Rep, fn), xs).valueOf()
  }
)

// foldLength :: [ String ] -> Sum
const foldLength =
  foldMap(Sum, compose(Sum, x => x.length))

foldLength([ '12', '34', '567' ])
//=> Sum 7
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Monoid`, `Functor`, `Apply`, `Applicative`

</article>

<article id="topic-construction">

## Construction

```haskell
Const :: TypeRep T => T -> Const T
Const c :: c -> Const c a
```

`Const` is a Type Constructor that take a Constructor or TypeRep and will give
back an Instance Constructor that will take a value of the type provided.

```javascript
import Const from 'crocks/Const'

// StrConst :: Const String a
const StrConst =
  Const(String)

// BoolConst :: Const Boolean a
const BoolConst =
  Const(Boolean)

StrConst('always and forever')
//=> Const(String) "always and forever"

BoolConst(false)
//=> Const(Boolean) false
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Monoid m => Const(m).empty :: () -> Const m ()
```

When `Const` is fixed to a `Monoid` type, we automatically get
a `Monoid` implementation by creating an instance that points to
the `empty` element of the underlying `Monoid`. As this is just a "pass through"
of the underlying `Monoid`, everything valid for the underlying type, holds true
for `Const`.

`empty` will throw a `TypeError` if the underlying Type does not point to a type
of `Monoid`.

```javascript
```

#### of

```haskell
Monoid m => Const(m).of :: a -> Const m a
```

When `Const` is fixed to a `Monoid` type, we automatically get
an `Applicative` implementation by creating an instance that points to
the `empty` element of the underlying `Monoid`.

The `Applicative` laws work due to the fact that we can derive an `Apply` by
mapping all every morphism to the `concat` method of a pointed to `Semigroup`.
As, we must be a `Semigroup` before we can be a `Monoid`, [`ap`](#ap) is
guaranteed.

`of` will throw a `TypeError` if the underlying Type does not point to a type
of `Monoid`.

```javascript
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Const c a ~> b -> Boolean
```

Used to compare the underlying values of two `Const` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
argument is a `Const` with an underlying `left` value equal to the underlying
value of the `Const` the method is being called on. If the passed argument is
not a `Const` or the underlying values are not equal, `equals` will
return `false`.

```javascript
import Const from 'crocks/Const'

// NumConst :: Const Number a
const NumConst =
  Const(Number)

// ArrConst :: Const Array a
const ArrConst =
  Const(Array)

NumConst(2)
  .equals(NumConst(5))
//=> false

NumConst(5)
  .equals(NumConst(5))
//=> true

ArrConst([ 'a', 'b' ])
  .equals(ArrConst([ 'c', 'd' ]))
//=> false

ArrConst([ 'c', 'd' ])
  .equals(ArrConst([ 'c', 'd' ]))
//=> true
```

#### concat

```haskell
Semigroup s => Const s a ~> Const s a -> Const s a
```

`concat` is used to combine two `Semigroup`s of the same type under an operation
specified by the `Semigroup`. When a `Const` instance is fixed to
a `Semigroup` type, it will combine the two values that each `Const` points to
using the `concat` method of the underlying `Semigroup`.

`concat` will throw a `TypeError` if the underlying Type does not point to a
type of `Semigroup`.

```javascript
import Const from 'crocks/Const'

import Maybe from 'crocks/Maybe'
import Sum from 'crocks/Sum'

const { Just } = Maybe

const ArrayConst =
  Const(Array)

const MaybeConst =
  Const(Maybe)

ArrayConst([ 'a', 'b' ])
  .concat(ArrayConst([ 'c' ]))
//=> Const(Array) [ "a", "b", "c" ]

// a :: Maybe Sum
const a =
  Just(Sum(10))

// b :: Maybe Sum
const b =
  Just(Sum(32))

MaybeConst(a)
  .concat(MaybeConst(b))
  .valueOf()
//=> Just (Sum 42)
```

#### map

```haskell
Const c a ~> (a -> b) -> Const c b
```

Typically used to lift a function into the context of an ADT, but due to the
unique behavior of `Const`, any function that is passed in to `map` will be
validated but it will not be applied. `map` will return a new `Const` with
the same left value.

```javascript
import Const from 'crocks/Const'
import Identity from 'crocks/Identity'
import Maybe from 'crocks/Maybe'

import map from 'crocks/pointfree/map'

const { Just } = Maybe

// MaybeConst :: Maybe a -> MaybeConst (Maybe a)
const MaybeConst =
  Const(Maybe)

// add10 :: Functor f => f Number -> f Number
const add10 =
  map(x => x + 10)

Identity(Just(3))
  .map(add10)
//=> Identity Just 13

MaybeConst(Just(3))
  .map(add10)
//=> Const(Maybe) Just 3
```

#### ap

```haskell
Semigroup s => Const s (a -> b) ~> Const s a -> Const s b
```

The unique nature of the `Const` functor allows any underlying `Semigroup` to
act an an `Apply`. When on `Const` is applied to another `Const` whose
underlying `Semigroup`s match, the `Semigroup`s will be combined by
calling `concat` on the underlying `Semigroup`.

`ap` will throw a `TypeError` if the underlying Type does not point to a type
of `Semigroup`.

```javascript
import Const from 'crocks/Const'

// prod :: Number -> Number -> Number
const prod =
  x => y => x * y

Const(5)
  .map(prod)
  .ap(Const(27))
//=> Const 5
```

#### valueOf

```haskell
Const c a ~> () -> c
```

`valueOf` is used as a means of extraction. This function is used primarily for
convenience for some of the helper functions that ship with `crocks`.
Calling `valueOf` on a `Const` instance will result in the underlying left value
of the `Product` type.

```javascript
import Const from 'crocks/Const'

const ArrayConst =
  Const(Array)

ArrayConst([ 33 ])
  .valueOf()
//=> [ 33 ]

ArrayConst([ 35 ])
  .concat(ArrayConst([ 20 ]))
  .valueOf()
//=> [ 35, 20 ]
```

</article>
