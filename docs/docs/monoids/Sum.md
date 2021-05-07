---
title: "Sum"
description: "Sum Monoid"
layout: "guide"
weight: 100
---

```haskell
Sum Number
```

`Sum` is a `Monoid` that will combine (2) `Number`s under addition.

```js runkit
import Sum from 'crocks/Sum'
import mconcat from 'crocks/helpers/mconcat'
import mconcatMap from 'crocks/helpers/mconcatMap'

Sum(13)
//=> Sum 13

mconcat(Sum, [ 5, 2 ])
//=> Sum 7

Sum(10)
  .concat(Sum(10))
//=> Sum 20

// sumByTen :: [ Number ] -> Sum
const sumByTen =
  mconcatMap(Sum, x => x * 10)

sumByTen([ 2, 2 ])
//=> Sum 40
```

## Implements

`Setoid`, `Semigroup`, `Monoid`

## Construction

```haskell
Sum :: Number -> Sum Number
```

`Sum` provides addition on `Number`s and needs to be constructed with
a `Number` instance. Calling the constructor with a `Number`, results in a
new `Sum` that wraps the provided `Number`.

Passing `undefined`, `NaN` or `null` to the constructor will result in
an `empty` instance, or an instance containing a `0`.

```js runkit
import Sum from 'crocks/Sum'

import equals from 'crocks/pointfree/equals'

Sum(41)
//=> Sum 41

Sum(Infinity)
//=> Sum Infinity

Sum(NaN)
//=> Sum 0

equals(Sum(undefined), Sum.empty())
//=> true
```

## Constructor Methods

### empty

```haskell
Sum.empty :: () -> Sum
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Sum` the result of `empty` is `0`. `empty` is available on both
the Constructor and the Instance for convenience.

```js runkit
import Sum from 'crocks/Sum'

Sum.empty()
//=> Sum 0

Sum.empty()
  .concat(Sum.empty())
//=> Sum 0

Sum(4)
  .concat(Sum.empty())
//=> Sum 4

Sum.empty()
  .concat(Sum(4))
//=> Sum 4
```

## Instance Methods

### equals

```haskell
Sum a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Sum` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
argument is a `Sum` with an underlying value equal to the underlying value of
the `Sum` the method is being called on. If the passed argument is not
a `Sum` or the underlying values are not equal, `equals` will return `false`.

```js runkit
import Sum from 'crocks/Sum'

Sum(5)
  .equals(Sum(5))
//=> true

Sum(25)
  .equals(Sum(31))
//=> false
```

### concat

```haskell
Sum ~> Sum -> Sum
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Sum`, it will add the
(2) `Number`s.

```js runkit
import Sum from 'crocks/Sum'

Sum(5)
  .concat(Sum(4))
//=> Sum 9

Sum(45)
  .concat(Sum(32))
//=> Sum 77

Sum(1000)
  .concat(Sum(Infinity))
//=> Sum Infinity

Sum(1)
  .concat(Sum(3))
//=> Sum 4
```

### valueOf

```haskell
Sum ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily
a `Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Sum` instance
will result in the underlying `Number`.

```js runkit
import Sum from 'crocks/Sum'

Sum(4)
  .valueOf()
//=> 4

Sum.empty()
  .valueOf()
//=> 0

Sum(34)
  .concat(Sum(21))
  .valueOf()
//=> 55
```

