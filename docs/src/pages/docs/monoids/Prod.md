---
title: "Prod"
description: "Prod Monoid"
layout: "guide"
weight: 90
---

```haskell
Prod Number
```

`Prod` is a `Monoid` that will combine (2) `Number`s under multiplication.

```javascript
const Prod = require('crocks/Prod')
const compose = require('crocks/helpers/compose')
const concat = require('crocks/pointfree/concat')

const emptyProd = Prod.empty()
const tenProd = Prod(10)
const hundredProd = Prod(100)

emptyProd
  .concat(emptyProd)
//=> Prod 1

tenProd
  .concat(hundredProd)
//=> Prod 1000

// prodBy2 :: Number -> Prod
const double =
  compose(concat(Prod(2)), Prod)

double(4)
//=> Prod 8

double(11)
//=> Prod 22
```

<article id="topic-implements">

## Implements

`Semigroup`, `Monoid`

</article>

<article id="topic-constructor">

## Constructor Methods

### empty

```haskell
Prod.empty :: () -> Prod
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to object other value, it will return the other value.
In the case of `Prod` the result of `empty` is `1`. `empty` is available on
both the Constructor and the Instance for convenience.

```javascript
const Prod = require('crocks/Prod')

Prod.empty()
//=> Prod 1

Prod.empty()
  .concat(Prod.empty())
//=> Prod 1

Prod(4)
  .concat(Prod.empty())
//=> Prod 4

Prod.empty()
  .concat(Prod(4))
//=> Prod 4
```

### type

```haskell
Prod.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on
the standard `crocks` types. While type comparisons can easily be done manually
by calling `type` on a given type, using the `isSameType` function hides much
of the boilerplate. `type` is available on both the Constructor and the
Instance for convenience.

```javascript
const Prod = require('crocks/Prod')
const Sum = require('crocks/Sum')
const isSameType = require('crocks/predicates/isSameType')

const prod5 = Prod(5)

prod5.type()
//=> "Prod"

isSameType(Sum, prod5)
//=> false

isSameType(Prod, prod5)
//=> true

isSameType(Prod.empty(), prod5)
//=> true
```

</article>

<article id="topic-instance">

## Instance Methods

### concat

```haskell
Prod ~> Prod -> Prod
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Prod`, `concat` will
multiply the (2) `Number`s.

```javascript
const Prod = require('crocks/Prod')

Prod(5)
  .concat(Prod(4))
//=> Prod 20

Prod(45)
  .concat(Prod(32))
//=> Prod 1440

Prod(1000)
  .concat(Prod(Infinity))
//=> Prod Infinity

Prod.empty()
  .concat(Prod(3))
//=> Prod 3
```

### valueOf

```haskell
Prod ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While
the extraction is available, types that implement `valueOf` are not necessarily
a `Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Prod`
instance will result in the underlying `Number`.

```javascript
const Prod = require('crocks/Prod')

Prod.empty()
  .valueOf()
//=> 1

Prod(4)
  .valueOf()
//=> 4

Prod(34)
  .concat(21)
  .valueOf()
//=> 714
```

</article>
