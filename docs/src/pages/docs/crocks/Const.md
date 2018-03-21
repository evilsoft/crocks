---
title: "Const"
description: "Const Monoid"
layout: "guide"
weight: 80
---

```haskell
Const a
```

`Const` is a `chainable` that will take a any value `a` and regardless of the function called return a new `Const` with the same value.

```javascript
import Const from 'crocks/Const'

Const('Hello World')
//=> Const 'Hello World'

([ 'Today', 'Tomorrow', 'Yesterday' ])
   .map(Const)
   .reduce ((acc, c) => acc.concat(c))
//=> Const 'Today'

Const(100)
  .concat(Const(10))
//=> Min 100

Const('Hello')
  .map(x => x + x)
//=> Const 'Hello'
```

<article id="topic-implements">

## Implements

`ap`, `chain`, `concat`, `equals`, `map`
</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Min ~> Min -> Min
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Min`, it will result
in the smallest of the (2) `Number`s.

```javascript
import Min from 'crocks/Min'

Min(50)
  .concat(Min(24))
//=> Min 24

Min(-120)
  .concat(Min(-50))
//=> Min -120

Min.empty()
  .concat(Min(-Infinity))
//=> Min -Infinity
```

#### valueOf

```haskell
Min ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Min` instance
will result in the underlying `Number`.

```javascript
import Min from 'crocks/Min'

Min(33)
  .valueOf()
//=> 33

Min.empty()
  .valueOf()
//=> Infinity

Min(35)
  .concat(Min(20))
  .valueOf()
//=> 20
```

</article>
