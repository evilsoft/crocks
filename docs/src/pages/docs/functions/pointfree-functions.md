---
title: "Point-free Functions"
description: "Point-free Functions API"
layout: "notopic"
weight: 5
---

While it can seem natural to work with all these containers in a fluent fashion,
it can get cumbersome and hard to get a lot of reuse out of. A way to really get
the most out of reusability in Javascript is to take what is called a point-free
approach. Below is a small code same to contrast the difference between the two
calling styles:

```javascript
const crocks = require('crocks')

const {
  compose, map, safe, isInteger
} = crocks // map is the point-free function

// isEven :: Integer -> Boolean
const isEven =
  x => (x % 2) === 0

// maybeInt :: a -> Maybe Integer
const maybeInt =
  safe(isInteger)

// fluentIsEven :: a -> Maybe Boolean
const fluentIsEven = data =>
  maybeInt(data)
    .map(isEven)

// pointfreeIsEven :: a -> Maybe Boolean
const pointfreeIsEven =
  compose(map(isEven), maybeInt)
```

These functions provide a very clean way to build out very simple functions and
compose them all together to compose a more complicated flow. Each point-free
function provided in `crocks` is "auto-curried" and follows a "data-last"
pattern in the order of how it receives it's arguments. Typically the most
stable of the arguments comes first, moving all the way to the least stable
argument (which usually is the data flowing through your composition). Below
lists the provided functions and the data types they work with (`m` refers to an
accepted Datatype):

##### Signatures
| Function | Signature | Location |
|---|:---|:---|
| `alt` | `m a -> m a -> m a` | `crocks/pointfree` |
| `ap` | `m a -> m (a -> b) -> m b` | `crocks/pointfree` |
| `bimap` | `(a -> c) -> (b -> d) -> m a b -> m c d` | `crocks/pointfree` |
| `both` | `m (a -> b) -> m (Pair a a -> Pair b b)` | `crocks/pointfree` |
| `chain` | `(a -> m b) -> m a -> m b` | `crocks/pointfree` |
| `coalesce` | `(a -> c) -> (b -> c) -> m a b -> m _ c` | `crocks/pointfree` |
| `concat` | `m a -> m a -> m a` | `crocks/pointfree` |
| `cons` | `a -> m a -> m a` | `crocks/pointfree` |
| `contramap` | `(b -> a) -> m a -> m b` | `crocks/pointfree` |
| `either` | `(a -> c) -> (b -> c) -> m a b -> c` | `crocks/pointfree` |
| `empty` | `m -> m` | `crocks/pointfree` |
| `equals` | `m -> m -> Boolean` | `crocks/pointfree` |
| `evalWith` | `a -> m -> b` | `crocks/State` |
| `execWith` | `a -> m -> b` | `crocks/State` |
| `extend` | `(m a -> b) -> m a -> m b` | `crocks/pointfree` |
| `filter` | <code>((a -> Boolean) &#124; Pred a) -> m a -> m a</code> | `crocks/pointfree` |
| `first` | `m (a -> b) -> m (Pair a c -> Pair b c)` | `crocks/pointfree` |
| `fold` | `Semigroup s => m s -> s` | `crocks/pointfree` |
| `fst` | `m a b -> a` | `crocks/Pair` |
| `head` | `m a -> Maybe a` | `crocks/pointfree` |
| `log` | `m a b -> a` | `crocks/Writer` |
| `map` | `(a -> b) -> m a -> m b` | `crocks/pointfree` |
| `merge` | `(a -> b -> c) -> m a b -> c` | `crocks/Pair` |
| `option` | `a -> m a -> a` | `crocks/pointfree` |
| `promap` | `(c -> a) -> (b -> d) -> m a b -> m c d` | `crocks/pointfree` |
| `read` | `m a b -> Pair a b` | `crocks/Writer` |
| `reduce` | `(b -> a -> b) -> b -> m a -> b` | `crocks/pointfree` |
| `reject` | <code>((a -> Boolean) &#124; Pred a) -> m a -> m a</code> | `crocks/pointfree` |
| `run` | `m a -> b` | `crocks/pointfree` |
| `runWith` | `a -> m -> b` | `crocks/pointfree` |
| `second` | `m (a -> b) -> m (Pair c a -> Pair c b)` | `crocks/pointfree` |
| `sequence` | `Applicative f => (b -> f b) -> m (f a) -> f (m a)` | `crocks/pointfree` |
| `snd` | `m a b -> b` | `crocks/Pair` |
| `swap` | `(c -> d) -> (a -> b) -> m c a -> m b d` | `crocks/pointfree` |
| `tail` | `m a -> Maybe (m a)` | `crocks/pointfree` |
| `traverse` | `Applicative f => (c -> f c) -> (a -> f b) -> m (f a) -> f (m b)` | `crocks/pointfree` |
| `valueOf` | `m a -> a` | `crocks/pointfree` |

##### Datatypes
| Function | Datatypes |
|---|:---|
| `alt` | `Async`, `Either`, `Maybe`, `Result` |
| `ap` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `Result`, `State`, `Unit`, `Writer` |
| `bimap` | `Async`, `Either`, `Pair`, `Result` |
| `both` | `Arrow`, `Function`, `Star` |
| `chain` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `Result`, `State`, `Unit`, `Writer` |
| `coalesce` | `Async`, `Either`, `Maybe`, `Result` |
| `concat` | `All`, `Any`, `Array`, `Assign`, `Const`, `Either`, `Endo`, `First`, `Identity`, `Last`, `List`, `Max`, `Maybe`, `Min`, `Pair`, `Pred`, `Prod`, `Result`, `String`, `Sum`, `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | `Arrow`, `Pred`, `Star` |
| `either` | `Either`, `Maybe`, `Result` |
| `empty` | `All`, `Any`, `Array`, `Assign`, `Endo`, `First`, `Last`, `List`, `Max`, `Min`, `Object`, `Pred`, `Prod`, `String`, `Sum`, `Unit` |
| `evalWith` | `State` |
| `execWith` | `State` |
| `extend` | `Pair` |
| `filter` | `Array`, `List`, `Object` |
| `first` | `Arrow`, `Function`, `Star` |
| `fold` | `Array`, `List` |
| `fst` | `Pair` |
| `head` | `Array`, `List`, `String` |
| `log` | `Writer` |
| `map` | `Async`, `Array`, `Arrow`, `Const`, `Either`, `Function`, `Identity`, `IO`, `List`, `Maybe`, `Object`, `Pair`, `Reader`, `Result`, `Star`, `State`, `Unit`, `Writer` |
| `merge` | `Pair` |
| `option` | `First`, `Last`, `Maybe` |
| `promap` | `Arrow`, `Star` |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `reject` | `Array`, `List`, `Object` |
| `run` | `IO` |
| `runWith` | `Arrow`, `Endo`, `Pred`, `Reader`, `Star`, `State` |
| `second` | `Arrow`, `Function`, `Star` |
| `sequence` | `Array`, `Either`, `Identity`, `List`, `Maybe`, `Result` |
| `snd` | `Pair` |
| `swap` | `Async`, `Either`, `Pair`, `Result` |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, `Either`, `Identity`, `List`, `Maybe`, `Result` |
| `valueOf` | `All`, `Any`, `Assign`, `Const`, `Endo`, `First`, `Identity`, `Last`, `Max`, `Min`, `Pred`, `Prod`, `Sum`, `Unit`, `Writer` |
