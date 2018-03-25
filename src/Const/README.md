---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 80
---

```haskell
Const c _
```
`Const` a unary function which creates a simple Product type which evaluates to
`c` for all inputs ignoring its right side. 
`Const` is a `chainable` that will take any value `c` and regardless of the 
function called on it will return a new `Const` with the value `c`.

### Contrived Examples
```javascript
import Const from 'crocks/Const'

Const('Hello World')
//=> Const 'Hello World'

const days = [ 'Today', 'Tomorrow', 'Yesterday' ]

days.map(Const).reduce((acc, c) => acc.concat(c))
//=> Const 'Today'

Const(100)
  .concat(Const(10))
//=> Min 100

Const('Hello')
  .map(x => x + x)
//=> Const 'Hello'
```

### Real-world example
```javascript
const { Pair, Const, compose, extend, fst, valueOf } = require('crocks')

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
// TBD methods " 'ap', 'chain', 'concat', 'equals', 'map'  "
```
</article>

<article id="topic-instance">

## Instance Methods

#### ap

```haskell
Const ~> Const -> Const
```

```javascript
```

#### chain

```haskell
Const ~> (a -> b) -> Const
```

```javascript
```

#### concat

```haskell
Const ~> Const -> Const
```

```javascript
```

#### equals

```haskell
Const ~> Const -> Boolean
```

```javascript
```

#### map

```haskell
Const ~> (a -> b) -> Const
```

```javascript
```

</article>
