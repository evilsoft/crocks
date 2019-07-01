---
title: "IO"
description: "IO Crock"
layout: "guide"
weight: 70
---

```haskell
IO a
```

[description]

<!-- eslint-disable no-console -->

```javascript
import composeK from 'crocks/helpers/composeK'
import curry from 'crocks/helpers/curry'

import IO from 'crocks/IO'

// log :: String -> a -> IO ()
const log = label => value => IO(
  () => console.log(`${label}:`, value)
)

// setEnv :: String -> a -> IO ()
const setEnv = curry(
  (name, value) => IO(
    () => { process.env[name] = value }
  )
)

// getEnv :: String -> IO a
const getEnv = name => IO(
  () => process.env[name]
)

// logEnv :: String -> () -> IO ()
const logEnv = name => () =>
  getEnv(name)
    .chain(log(name))

// setAndLog :: String -> a -> IO ()
const setAndLog = curry(
  name => composeK(logEnv(name), setEnv(name))
)

setAndLog('CROCKS_ENV', 'fun')
  .run()
//=> CROCKS_ENV: fun
```

<article id="topic-implements">

## Implements
`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
IO :: (() -> a) -> IO a
```

[description]

```javascript
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### of

```haskell
IO.of :: a -> IO a
```

[description]

```javascript
```

</article>

<article id="topic-instance">

## Instance Methods

#### map

```haskell
IO a ~> (a -> b) -> IO b
```

Used to apply transformations to values that have been lifted into an `IO`, `map`
takes a function that it will lift into the context of the `IO` and apply
to it the wrapped value.

```javascript
```

#### ap

```haskell
IO (a -> b) ~> IO a -> IO b
```

`ap` allows for values wrapped in an `IO` to be applied to functions also
wrapped in an `IO`. In order to use `ap`, the `IO` must contain a
function as its value. Under the hood, `ap` unwraps both the function
and the value to be applied and applies the value to the function. Finally it
will wrap the result of that application back into an `IO`. It is required
that the inner function is curried.

```javascript
```

#### chain

```haskell
IO a ~> (a -> IO b) -> IO b
```

Normally one of the ways `Chain`s like `IO` are able to be combined and
have their effects applied, is through `chain`. However `Identity` is different
because there are no effects to apply. `chain` will simply take a function that
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
