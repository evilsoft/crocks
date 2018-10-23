---
title: "Identity"
description: "Identity Crock"
layout: "guide"
weight: 60
---

```haskell
Identity a
```

`Identity` is one of the most versatile `monads`. Although it does not have any 
inherant behaviour its power comes from lifting a simple value into the monadic
space and applying the given `function` (`map`/`chain`/etc) to it's value. 
`Identity` is often used in place where a `monad` or `applicative` is expected. 
Identity is also known the "empty" functor and applicative functor. `Identity` 
composed with another functor or applicative functor is isomorphic to the 
original.

```javascript
import Identity from 'crocks/Identity'

Identity(10)
//=> Identity 10
```
<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Chain`, `Traversable`, `Apply`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Identity :: a -> Identity a
```

The contstructor for an `Identity` is a unary function. When a value is passed
in an `Identity` of the given value is returned ready for `map` or `chain`. 

```javascript
import Identity from 'crocks/Identity'

const fromComputerCode = String.fromCharCode

Identity(42)
  .map(fromComputerCode)
//=> Identity '*'

```

</article>

<article id="topic-constructor">

## Constructor Methods

#### of

```haskell
Identity.of :: a -> Identity a
```

`of` is used to construct an `Identity` with any given value. It is there to
allow `Identity` to function as a pointed functor. 

```javascript
import Identity from 'crocks/Identity'

const { of } = Identity

of(42)
//=> Identity 42

of(true)
//=> Identity true

```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Identity a ~> b -> Boolean
```

Used to compare the underlying values of two `Identity` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
arguments is a `Identity` with an underlying value equal to the underlying value
of the `Identity` the method is being called on. If the passed argument is not
an `Identity` or the underlying values are not equal, `equals` will return `false`.

```javascript
import Identity from 'crocks/Identity'

import equals from 'crocks/pointfree/equals'

Identity(33)
  .equals(Identity(33))
//=> true

Identity(33)
  .equals(Identity('33'))
//=> false

// by value, not reference for most types
Identity({ a: 86, b: true })
  .equals(Identity({ a: 86, b: true }))
//=> true

equals(Identity(95), 95)
//=> false

equals(Identity([ 2, 3 ]), Identity([ 2, 3 ]))
//=> true
```

#### concat

```haskell
Identity s => Identity s ~> Identity s -> Identity s
```

When an underlying value of a given `Identity` is fixed to a `Semigroup`, 
`concat` can be used to concat another `Identity` instance with an underlying
`Semigroup` of the same type. Expecting a `Identity` wrapping a `Semigroup` of
the same type, `concat` will give back a new `Identity` instance wrapping the
result of combining the two underlying `Semigroup`s.

```javascript
import Identity from 'crocks/Identity'

import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import flip from 'crocks/combinators/flip'
import map from 'crocks/pointfree/map'
import mapReduce from 'crocks/helpers/mapReduce'
import valueOf from 'crocks/pointfree/valueOf'

// empty :: Identity Sum
const empty =
  Identity(Sum.empty())

// sumList :: [ * ] -> Identity Number
const sumList = compose(
  map(valueOf),
  mapReduce(compose(Identity, Sum), flip(concat), empty)
)

Identity([ 34 ])
  .concat(Identity([ 92 ]))
//=> Identity [ 34, 92 ]

sumList([ 3, 4, 5 ])
//=> Identity 12

```

#### map

```haskell
Identity a ~> (a -> b) -> Identity b
```

Used to apply transformations to values you've lifted into an `Identity`, `map`
takes a function that it will lift into the context of the `Identity` and apply
to it the wrapped value. `Identity` contains no bahaviour and will do nothing
more than apply the value inside the `Identity` to the function.

```javascript
import Identity from 'crocks/Identity'
import map from 'crocks/pointfree/map'

const prod = a => b => a * b

const mapDouble = map(prod(2))

mapDouble(Identity(5))
//=> Identity 10
```

#### ap

```haskell
Identity (a -> b) ~> Identity a -> Identity b
```

`ap` allows for values wrapped in a `Identity` to be applied to functions also
wrapped in a `Identity`. In order to use `ap`, the `Identity` must contain a
function as its value. Under the hood, `ap` unwraps both the function
and the value to be applied and applies the value to the function. Finally it
will wrap the result of that application back into a `Identity`. It is required
that the inner function is curried.

```javascript
import Identity from 'crocks/Identity'

const prod = a => b => a * b
const double = prod(2)

Identity(double)
  .ap(5)
//=> Identity 10

```

#### sequence

```haskell
Apply f => Identity (f a) ~> (b -> f b) -> f (Identity a)
Applicative f => Identity (f a) ~> TypeRep f -> f (Identity a)
```

When an instance of `Identity` wraps an `Apply` instance, `sequence` can be used to
swap the type sequence. `sequence` requires either an `Applicative TypeRep` or
an `Apply` returning function is provided for its argument.

`sequence` can be derived from [`traverse`](#traverse) by passing it an
`identity` function (`x => x`).

```javascript
import Identity from 'crocks/Identity'

import Maybe from 'crocks/Maybe'
import sequence from 'crocks/pointfree/sequence'

// seqId :: Identity Maybe a -> Maybe Identity a
const seqMaybe =
  sequence(Maybe)

seqMaybe(Identity(Maybe(42)))
//=> Just Identity 42
```

#### traverse

#### chain

```haskell
Identity a ~> (a -> Identity b) -> Identity b
```

Normally one of the ways `Monad`s like `Identity` are able to be combined and 
have their effects applied is through `chain`. However `Identity` is different
because there are no effects to apply. `chain` will simply take a func that 
returns `Identity` and applies it to its value.

```javascript
import Identity from 'crocks/Identity'
import compose from 'crocks/helpers/compose'
import chain from 'crocks/pointfree/chain'

const prod = a => b => a * b
const doubleAsIdentity = compose(Identity, prod(2))

doubleAsIdentity(21)
//=> Identity 42

chain(doubleAsIdentity, Identity(5))
//=> Identity 10

```

</article>
