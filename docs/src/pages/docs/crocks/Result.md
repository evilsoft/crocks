---
title: "Result"
description: "Result Crock"
layout: "guide"
functions: ["trycatch", "eithertoresult", "firsttoresult", "lasttoresult", "maybetoresult"]
weight: 90
---

```haskell
Result e a = Err e | Ok a
```

Result is a Sum Type a step above [`Result`][maybe]. With a [`Result`][maybe] the
left side contains no information, where as with a `Result` the left contains
the error information from an operation. `Result` is well suited for capturing 
disjunction when the cause of the "error" case needs to be communicated. For 
example, when executing a function and you exception is important or useful.

A `Result` represents disjunction by using two constructors, [`Err`](#err) or [`Ok`](#ok).
An [`Ok`](#ok) instance represents the positive result while [`Err`](#err) is considered
the negative. With the exception of [`coalesce`](#coalesce), [`swap`](#swap)
and [`bimap`](#bimap), all `Result` returning methods on an instance will be
applied to a [`Ok`](#ok) returning the result. If an instance is a [`Err`](#err), then all application is skipped and another [`Err`](#err) is returned.

It is recommended to use the available [`Ok`](#ok) and [`Err`](#err)
constructors to construct `Result` instances in most cases. You can use the
`Result` constructor to construct a [`Ok`](#ok), but it will read better to just use
`Ok`.

```javascript
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Apply`, `Traversable`,
`Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Result :: a -> Result e a
```

Most of the time, `Result` is constructed using functions of your own making
and helper functions like [`tryCatch`](#trycatch) or by employing one of the
instance constructors, [`Ok`](#ok) or [`Err`](#err). This is due to the nature
of `Result` and most other Sum Types.

As a matter of consistency and completion, a `Result` instance can also be
constructed using its TypeRep like any other type. The `Result` constructor is a
unary function that accepts any type `a` and returns a [`Ok`](#ok) instance, wrapping
the value passed to its argument.

```javascript
import Result from 'crocks/Result'
import equals from 'crocks/pointfree/equals'

const { Ok, Err, of } = Result

Result('some string')
//=> Ok "some string"

Result(null)
//=> Ok null

Result(undefined)
//=> Ok undefined

of('some string')
//=> Ok "some string"

of(null)
//=> Ok null

of(undefined)
//=> Ok undefined

Ok('some string')
//=> Ok "some string"

Ok(null)
//=> Ok null

Ok(undefined)
//=> Ok undefined
//=> Ok undefined

Err('some string')
//=> Err "some string"

Err(null)
//=> Err null

Err(undefined)
//=> Err undefined

equals(
  Result.Ok([ 1, 2, 3 ]),
  Result.of([ 1, 2, 3 ])
)
//=> true

equals(
  of({ a: 100 }),
  Result({ a: 100 })
)
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Err

```haskell
Result.Err :: e -> Result e a
```

Used to construct an [`Err`](#err) instance that represents the "false" or 
"Negative" portion of a disjunction. When an instance is an [`Err`](#err), most
`Result` returning methods will just return another [`Err`](#err). 

```javascript
import Result from 'crocks/Result'

import chain from 'crocks/pointfree/chain'
import isNumber from 'crocks/predicates/isNumber'
import ifElse from 'crocks/logic/ifElse'

const { Ok, Err } = Result

// buildError :: String -> String
const buildError = x => Err(`${x} is not a valid number`)

// add10 :: Number -> Number
const add10 =
  x => x + 10

// protectedAdd10 :: a -> Result String Number
const protectedAdd10 =
    ifElse(isNumber, x => Ok(add10(x)), buildError)

Ok(23)
  .map(add10)
//=> Ok 33

Err(23)
  .map(add10)
//=> Err

chain(protectedAdd10, Ok(10))
//=> Ok 20

chain(protectedAdd10, Err('d'))
//=> Err "d is not a valid number"
```

#### Ok

```haskell
Result.Ok :: a -> Result e a
```

Used to construct a [`Ok`](#ok) instance that represents the "true" portion of a
disjunction or a valid value.  [`Ok`](#ok) will wrap any given value in
a [`Ok`](#ok), signaling the validity of the wrapped value.

```javascript
```