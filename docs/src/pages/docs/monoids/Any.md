---
title: "Any"
description: "Any Monoid"
layout: "guide"
weight: 20
---

```haskell
Any Boolean
```

`Any` is a `Monoid` that will combine (2) values of any type using logical
disjunction (OR) on their coerced `Boolean` values, mapping truth-y values to
`true` and false-y values to `false`.

```javascript
import Any from 'crocks/Any'

import isNumber from 'crocks/predicates/isNumber'
import mconcatMap from 'crocks/helpers/mconcat'

const trueString = Any('string')
const falseString = Any('')
const object = Any({ nice: true })

trueString.concat(falseString)
//=> Any false

trueString.concat(object)
//=> Any true

const anyNumber =
  mconcatMap(Any, isNumber)

anyNumber([ 'string', 3 ])
//=> Any true

anyNumber([ true, 'string' ])
//=> Any false
```

<article id="topic-implements">

## Implements

`Semigroup`, `Monoid`

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Any.empty :: () -> Any
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Any` the result of `empty` is `false`. `empty` is available on both
the Constructor and the Instance for convenience.

```javascript
import Any from 'crocks/Any'

Any.empty() //=> Any false

Any(true).concat(Any.empty())   //=> Any true
Any(false).concat(Any.empty())  //=> Any false
```

</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Any ~> Any -> Any
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Any`, it will combine the (2)
using logical OR (disjunction).

```javascript
import Any from 'crocks/Any'

Any(true).concat(Any(true))   //=> Any true
Any(true).concat(Any(false))  //=> Any true
Any(false).concat(Any(true))  //=> Any true
Any(false).concat(Any(false)) //=> Any false
```

#### valueOf

```haskell
Any ~> () -> Boolean
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on an `Any` instance
will result in the underlying `Boolean` value.

```javascript
import Any from 'crocks/Any'

Any(0).valueOf()        //=> false
Any('string').valueOf() //=> true

//=> true
Any(45)
  .concat('')
  .valueOf()
```

</article>
