---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 80
---

```haskell
Const c a
```
`Const` is a function that takes a single value and returns a `Product` type
that ignores its right side. 
`Const` is a `chainable` that will take any value `c` and regardless of the 
method called on it will return a new `Const` with the value `c`.

### Example
```javascript
import Const from 'crocks/Const'
import Pair from 'crocks/Pair'
import compose from 'crocks/helpers/compose'
import extend from 'crocks/pointfree/extend'
import fst from 'crocks/Pair/fst'
import valueOf from 'crocks/pointfree/valueOf'

Const('Hello World')
//=> Const 'Hello World'

const days = [ 'Today', 'Tomorrow', 'Yesterday' ]

days.map(Const).reduce((acc, c) => acc.concat(c))
//=> Const 'Today'

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
`Functor`, `Apply`, `Chain`

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Const c a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Const` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
arguments is a `Const` with an underlying `left` value equal to the underlying value
of the `Const` the method is being called on. If the passed argument is not
a `Const` or the underlying values are not equal, `equals` will return `false`.

```javascript
import { Const } from 'crocks'

const two = Const(2)
const four = Const(4)

two.equals(four)
//=> false

two.equals(Const(2))
//=> True
```

#### concat

```haskell
Const c a ~> Const c a -> Const c a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Const`, it will return a new
`Const` instance with the original value.

```javascript
import { Const, concat, map } from 'crocks'

const account1 = { firstName: 'John', lastName: 'Doe', achievments: [ '112', '232', '154' ] }
const account2 = { firstName: 'Jon', lastName: 'Doe', achievments: [ '767', '989' ] }

const constMerge = xs =>
  map(Const, xs)
    .reduce(concat)
    .valueOf()

const reduceAccounts = (acc, cur) => ({
  firstName: constMerge([ cur.firstName, acc.firstName ]),
  lastName: constMerge([ cur.lastName, acc.lastName ]),
  achievments: concat(cur.achievments, acc.achievments)
})

const mergeAccounts = accounts =>
  accounts
    .reduce(reduceAccounts)

mergeAccounts([ account1, account2 ])
```

#### map

```haskell
Const c a ~> (a -> b) -> Const c b
```

In a `Product` type the left side is always fixed and the right side is mapped.
Due to the unique property of `Const` any function that is passed in to `map`
will be validated but it will not be evaluated. `map` will return a new `const`
with the same left value.

```javascript
import { Const } from 'crocks'

Const('initial')
  .map(x => x.fakeProperty)
//=> Const 'initial'

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
import { Const } from 'crocks'

// prod :: Number -> Number -> Number
const prod = x => y => x * y

// Const -> Const
Const(prod)
  .ap(Const(5))
  .ap(Const(27))
//=> Const prod
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
import { Const } from 'crocks'

Const('initial')
  .chain(x => Const(x.fakeProperty))
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
import { Const } from 'crocks'

Const(33)
  .valueOf()
//=> 33

Const(35)
  .concat(Const(20))
  .valueOf()
//=> 35
```
</article>
