---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 80
---

```haskell
Const c a
```
`Const` a unary function which creates a simple Product type that evaluates to
`c` for all inputs ignoring its right side. 
`Const` is a `chainable` that will take any value `c` and regardless of the 
function called on it will return a new `Const` with the value `c`.

### Example
```javascript
import Const from 'crocks/Const'

Const('Hello World')
//=> Const 'Hello World'

const days = [ 'Today', 'Tomorrow', 'Yesterday' ]

days.map(Const).reduce((acc, c) => acc.concat(c))
//=> Const 'Today'

Const(100)
  .concat(Const(10))
//=> Const 100

Const('Hello')
  .map(x => x + x)
//=> Const 'Hello'
```

### Example 2
```javascript
import Const from 'crocks/Const'
import Pair from 'crocks/Pair'
import compose from 'crocks/helpers/compose'
import extend from 'crocks/pointfree/extend'
import fst from 'crocks/Pair/fst'
import valueOf from 'crocks/pointfree/valueOf'

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

```javascript
// TBD - methods are " 'ap', 'chain', 'concat', 'equals', 'map'  "
```
</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Const c a ~> b -> Boolean
```

```javascript
```

#### concat

```haskell
Const c a ~> Const c a -> Const c a
```

```javascript
```

#### map

```haskell
Const c a ~> (a -> b) -> Const c b
```

```javascript
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
import { Const, compose } from 'crocks'

// prod :: Number -> Number -> Number
const prod = x => y => x * y

const doubleAndFreeze =
  compose(Const, prod(2))

doubleAndFreeze(7)
//=> Const 14

Const('initial')
  .map(x => x + x)
  .chain(doubleAndFreeze)
//=> Const 'initial'

```

</article>
