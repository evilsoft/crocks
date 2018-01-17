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
| `compareWith` | `a -> a -> m a -> b` | `crocks/pointfree` |
| `concat` | `m a -> m a -> m a` | `crocks/pointfree` |
| `cons` | `a -> m a -> m a` | `crocks/pointfree` |
| `contramap` | `(b -> a) -> m a -> m b` | `crocks/pointfree` |
| `either` | `(a -> c) -> (b -> c) -> m a b -> c` | `crocks/pointfree` |
| `empty` | `m -> m` | `crocks/pointfree` |
| `equals` | `m -> m -> Boolean` | `crocks/pointfree` |
| [`evalWith`][eval] | `s -> m -> a` | `crocks/State` |
| [`execWith`][exec] | `s -> m -> s` | `crocks/State` |
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
| `alt` | `Async`, `Either`, [`Maybe`][maybe-alt], `Result` |
| `ap` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, [`Maybe`][maybe-ap], `Pair`, [`Reader`][reader-ap], `Result`, [`State`][state-ap], `Unit`, `Writer` |
| `bimap` | `Async`, `Either`, `Pair`, `Result` |
| `both` | [`Arrow`][arrow-both], `Function`, `Star` |
| `chain` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, [`Maybe`][maybe-chain], `Pair`, [`Reader`][reader-chain], `Result`, [`State`][state-chain], `Unit`, `Writer` |
| `coalesce` | `Async`, `Either`, [`Maybe`][maybe-coalesce], `Result` |
| `compareWith` | [`Equiv`][equiv-compare] |
| `concat` | [`All`][all-concat], [`Any`][any-concat], `Array`, [`Assign`][assign-concat], `Const`, `Either`, [`Endo`][endo-concat], [`Equiv`][equiv-concat], `First`, `Identity`, `Last`, `List`, `Max`, [`Maybe`][maybe-concat], `Min`, `Pair`, [`Pred`][pred-concat], [`Prod`][prod-concat], `Result`, `String`, [`Sum`][sum-concat], `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | [`Arrow`][arrow-contra], [`Equiv`][equiv-contra], [`Pred`][pred-contra], `Star` |
| `either` | `Either`, [`Maybe`][maybe-either], `Result` |
| `empty` | [`All`][all-empty], [`Any`][any-empty], `Array`, [`Assign`][assign-empty], [`Endo`][endo-empty], [`Equiv`][equiv-empty], `First`, `Last`, `List`, `Max`, `Min`, `Object`, [`Pred`][pred-empty], [`Prod`][prod-empty], `String`, [`Sum`][sum-empty], `Unit` |
| [`evalWith`][eval] | [`State`][state-eval] |
| [`execWith`][exec] | [`State`][state-exec] |
| `extend` | `Pair` |
| `filter` | `Array`, `List`, `Object` |
| `first` | [`Arrow`][arrow-first], `Function`, `Star` |
| `fold` | `Array`, `List` |
| `fst` | `Pair` |
| `head` | `Array`, `List`, `String` |
| `log` | `Writer` |
| `map` | `Async`, `Array`, [`Arrow`][arrow-map], `Const`, `Either`, `Function`, `Identity`, `IO`, `List`, [`Maybe`][maybe-map], `Object`, `Pair`, [`Reader`][reader-map], `Result`, `Star`, [`State`][state-map], `Unit`, `Writer` |
| `merge` | `Pair` |
| `option` | `First`, `Last`, [`Maybe`][maybe-option] |
| `promap` | [`Arrow`][arrow-pro], `Star` |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `reject` | `Array`, `List`, `Object` |
| `run` | `IO` |
| `runWith` | [`Arrow`][arrow-run], [`Endo`][endo-run], [`Pred`][pred-run], [`Reader`][reader-run], `Star`, [`State`][state-run] |
| `second` | [`Arrow`][arrow-second], `Function`, `Star` |
| `sequence` | `Array`, `Either`, `Identity`, `List`, [`Maybe`][maybe-sequence], `Result` |
| `snd` | `Pair` |
| `swap` | `Async`, `Either`, `Pair`, `Result` |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, `Either`, `Identity`, `List`, [`Maybe`][maybe-traverse], `Result` |
| `valueOf` | [`All`][all-value], [`Any`][any-value], [`Assign`][assign-value], `Const`, [`Endo`][endo-value], [`Equiv`][equiv-value], `First`, `Identity`, `Last`, `Max`, `Min`, [`Pred`][pred-value], [`Prod`][prod-value], [`Sum`][sum-value], `Unit`, `Writer` |

[all-concat]: ../monoids/All.html#concat
[all-empty]: ../monoids/All.html#empty
[all-value]: ../monoids/All.html#valueof

[any-concat]: ../monoids/Any.html#concat
[any-empty]: ../monoids/Any.html#empty
[any-value]: ../monoids/Any.html#valueof

[assign-concat]: ../monoids/Assign.html#concat
[assign-empty]: ../monoids/Assign.html#empty
[assign-value]: ../monoids/Assign.html#valueof

[arrow-both]: ../crocks/Arrow.html#both
[arrow-contra]: ../crocks/Arrow.html#contramap
[arrow-first]: ../crocks/Arrow.html#first
[arrow-map]: ../crocks/Arrow.html#map
[arrow-pro]: ../crocks/Arrow.html#promap
[arrow-run]: ../crocks/Arrow.html#runwith
[arrow-second]: ../crocks/Arrow.html#second

[endo-concat]: ../monoids/Endo.html#concat
[endo-empty]: ../monoids/Endo.html#empty
[endo-run]: ../monoids/Endo.html#runwith
[endo-value]: ../monoids/Endo.html#valueof

[equiv-compare]: ../crocks/Equiv.html#comparewith
[equiv-concat]: ../crocks/Equiv.html#concat
[equiv-contra]: ../crocks/Equiv.html#contramap
[equiv-empty]: ../crocks/Equiv.html#empty
[equiv-value]: ../crocks/Equiv.html#valueof

[maybe-alt]: ../crocks/Maybe.html#alt
[maybe-ap]: ../crocks/Maybe.html#ap
[maybe-chain]: ../crocks/Maybe.html#chain
[maybe-coalesce]: ../crocks/Maybe.html#coalesce
[maybe-concat]: ../crocks/Maybe.html#concat
[maybe-either]: ../crocks/Maybe.html#either
[maybe-map]: ../crocks/Maybe.html#map
[maybe-option]: ../crocks/Maybe.html#option
[maybe-sequence]: ../crocks/Maybe.html#sequence
[maybe-traverse]: ../crocks/Maybe.html#traverse

[pred-concat]: ../crocks/Pred.html#concat
[pred-contra]: ../crocks/Pred.html#contramap
[pred-empty]: ../crocks/Pred.html#empty
[pred-run]: ../crocks/Pred.html#runwith
[pred-value]: ../crocks/Pred.html#valueof

[prod-concat]: ../monoids/Prod.html#concat
[prod-empty]: ../monoids/Prod.html#empty
[prod-value]: ../monoids/Prod.html#valueof

[sum-concat]: ../monoids/Sum.html#concat
[sum-empty]: ../monoids/Sum.html#empty
[sum-value]: ../monoids/Sum.html#valueof

[reader-ap]: ../crocks/Reader.html#ap
[reader-chain]: ../crocks/Reader.html#chain
[reader-map]: ../crocks/Reader.html#map
[reader-run]: ../crocks/Reader.html#runwith

[state-ap]: ../crocks/State.html#ap
[state-chain]: ../crocks/State.html#chain
[state-eval]: ../crocks/State.html#evalwith
[state-exec]: ../crocks/State.html#execwith
[state-map]: ../crocks/State.html#map
[state-run]: ../crocks/State.html#runwith

[exec]: ../crocks/State.html#execwith-pointfree
[eval]: ../crocks/State.html#evalwith-pointfree
