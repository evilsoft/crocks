---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 30
---

```haskell
Const c a
```

Const is a Product type the whose underlying left-most value is fixed to the
value it was originally constructed with. This ensures that a desired value is
immutable. While its right portion can still be mapped over, when observed, all
information on the right will be discarded, leaving only the initial fixed
value `c`.

```javascript
import Const from 'crocks/Const'
import Pair from 'crocks/Pair'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import extend from 'crocks/pointfree/extend'
import flip from 'crocks/combinators/flip'
import fst from 'crocks/Pair/fst'
import valueOf from 'crocks/pointfree/valueOf'

Const('Hello World')
//=> Const 'Hello World'

// days :: [ String ]
const days =
  [ 'Today', 'Tomorrow', 'Yesterday' ]

days
  .map(Const)
  .reduce(flip(concat))
//=> Const "Today"

Const(100)
  .concat(Const(10))
//=> Const 100

// toLower :: String -> String
const toLower =
  x => x.toLowerCase()

// Field :: Pair (Const a) a
// updateField :: a -> Field
const updateField =
  value => Pair(Const(value), value)

// updateField :: Field -> Field
const resetField =
  extend(compose(valueOf, fst))

const changed =
  updateField('Joey')
    .map(toLower)
    .chain(updateField)
//=> Pair( Const "Joey", "joey" )

resetField(changed)
//=> Pair( Const "Joey", "Joey" )
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Apply`, `Chain`

</article>

<article id="topic-construction">

## Construction

```haskell
Const :: c -> Const c a
```

The constructor for `Const` is a unary function that takes any type as its
argument. Once constructed, the value will occupy the far left parameter `c`.

```javascript
import Const from 'crocks/Const'

Const('always and forever')
//=> Const String a

Const(false)
//=> Const Boolean a
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Const c a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Const` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
arguments is a `Const` with an underlying `left` value equal to the underlying
value of the `Const` the method is being called on. If the passed argument is
not a `Const` or the underlying values are not equal, `equals` will
return `false`.

```javascript
import Const from 'crocks/Const'

Const(2)
  .equals(Const(5))
//=> false

Const([ 1, 2, 3 ])
  .equals(Const([ 1, 2, 3 ]))
//=> true
```

#### concat

```haskell
Const c a ~> Const c a -> Const c a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Const`, it will return a new
`Const` instance with the original value.

```javascript
import Const from 'crocks/Const'

import concat from 'crocks/pointfree/concat'
import map from 'crocks/pointfree/map'

// Account :: {
//   firstName: String,
//   lastName: String,
//   achievements: [ String ]
// }

// account1 :: Account
const account1 = {
  firstName: 'John',
  lastName: 'Doe',
  achievements: [ '232', '154' ]
}

// account2 :: Account
const account2 = {
  firstName: 'Joe',
  lastName: 'Blow',
  achievements: [ '989' ]
}

// constMerge :: [ a ] -> a
const constMerge = xs =>
  map(Const, xs)
    .reduce(concat)
    .valueOf()

// reduceAccounts :: (Account, Account) -> Account
const reduceAccounts = (acc, cur) => ({
  firstName: constMerge([ cur.firstName, acc.firstName ]),
  lastName: constMerge([ cur.lastName, acc.lastName ]),
  achievements: concat(cur.achievements, acc.achievements)
})

// mergeAccounts :: [ Account ] -> Account
const mergeAccounts = accounts =>
  accounts
    .reduce(reduceAccounts)

mergeAccounts([ account1, account2 ])
//=> {
//   firstName: "John",
//   lastName: "Doe",
//   achievements: [ '232', '154', '989' ]
// }
```

#### map

```haskell
Const c a ~> (a -> b) -> Const c b
```

Typically used to lift a function into the context of an ADT, but due to the
unique behavior of `Const`, any function that is passed in to `map` will be
validated but it will not be applied. `map` will return a new `Const`
with the same left value.

```javascript
import Const from 'crocks/Const'

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

Const('initial')
  .map(toUpper)
//=> Const "initial"
```

#### ap

```haskell
Const c (a -> b) ~> Const c a -> Const c b
```

Short for apply, `ap` is normally used to apply a `Const` instance containing a
value to another `Const` instance that contains a function, resulting in new
`Const` instance with the result. However, due to the unique nature of `Const`
the function will remain the active value in the `Const`.

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

#### chain

```haskell
Const c a ~> (a -> Const c b) -> Const c b
```

Combining a sequential series of transformations that capture disjunction can
be accomplished with `chain`. `chain` expects a unary, `Const` returning
function as its argument. When invoked the inner value will not be passed to
provided function. A new `Const` will be returned with the same inner value.

```javascript
import Const from 'crocks/Const'

Const('initial')
  .chain(x => Const(x.toUpperCase()))
//=> Const 'initial'
```

#### valueOf

```haskell
Const c a ~> () -> c
```

`valueOf` is used as a means of extraction. This function
is used primarily for convenience for some of the helper functions that ship
with `crocks`. Calling `valueOf` on a `Const` instance will result in the
underlying left value of the `Product` type.

```javascript
import Const from 'crocks/Const'

Const(33)
  .valueOf()
//=> 33

Const(35)
  .concat(Const(20))
  .valueOf()
//=> 35
```

</article>
