---
title: "Point-free Functions"
description: "Point-free Functions API"
layout: "notopic"
functions: ["alt", "ap", "bimap", "both", "chain", "coalesce", "comparewith", "concat", "cons", "contramap", "either", "empty", "equals", "extend", "filter", "first", "fold", "foldmap", "head", "map", "merge", "option", "promap", "race", "reduce", "reduceright", "run", "runwith", "second", "sequence", "swap", "tail", "traverse", "valueof"]
weight: 50
---

While it can seem natural to work with all these containers in a fluent fashion,
it can get cumbersome and hard to get a lot of reuse out of. A way to really get
the most out of re-usability in JavaScript is to take what is called a point-free
approach. Below is a small code same to contrast the difference between the two
calling styles:

```javascript
import crocks from 'crocks'

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
| `foldMap` | `Semigroup s => (a -> s) -> m a -> s` | `crocks/pointfree` |
| [`fst`][fst] | `m a b -> a` | `crocks/Pair` |
| `head` | `m a -> Maybe a` | `crocks/pointfree` |
| `log` | `m a b -> a` | `crocks/Writer` |
| `map` | `(a -> b) -> m a -> m b` | `crocks/pointfree` |
| `merge` | `(a -> b -> c) -> m a b -> c` | `crocks/pointfree` |
| [`nmap`][nmap] | `Integer -> ...(* -> *) m ...* -> m ...*` | `crocks/Tuple` |
| `option` | `a -> m a -> a` | `crocks/pointfree` |
| `promap` | `(c -> a) -> (b -> d) -> m a b -> m c d` | `crocks/pointfree` |
| [`race`][race] | `m e a -> m e a -> m e a` | `crocks/Async` |
| `read` | `m a b -> Pair a b` | `crocks/Writer` |
| `reduce` | `(b -> a -> b) -> b -> m a -> b` | `crocks/pointfree` |
| `reduceRight` | `(b -> a -> b) -> b -> m a -> b` | `crocks/pointfree` |
| `reject` | <code>((a -> Boolean) &#124; Pred a) -> m a -> m a</code> | `crocks/pointfree` |
| `run` | `m a -> b` | `crocks/pointfree` |
| `runWith` | `a -> m -> b` | `crocks/pointfree` |
| `second` | `m (a -> b) -> m (Pair c a -> Pair c b)` | `crocks/pointfree` |
| `sequence` | <code>Applicative TypeRep t, Apply f => (t &#124; (b -> f b)) -> m (f a) -> f (m a)</code> | `crocks/pointfree` |
| [`snd`][snd] | `m a b -> b` | `crocks/Pair` |
| `swap` | `(c -> d) -> (a -> b) -> m c a -> m b d` | `crocks/pointfree` |
| `tail` | `m a -> Maybe (m a)` | `crocks/pointfree` |
| `traverse` | <code>Applicative TypeRep t, Apply f => (t &#124; (c -> f c)) -> (a -> f b) -> m (f a) -> f (m b)</code> | `crocks/pointfree` |
| `valueOf` | `m a -> a` | `crocks/pointfree` |

##### Datatypes
| Function | Datatypes |
|---|:---|
| `alt` | [`Async`][async-alt], [`Either`][either-alt], [`Maybe`][maybe-alt], `Result` |
| `ap` | `Array`, [`Async`][async-ap], [`Const`][const-ap], [`Either`][either-ap], `Identity`, `IO`, `List`, [`Maybe`][maybe-ap], [`Pair`][pair-ap], [`Reader`][reader-ap], `Result`, [`State`][state-ap], `Unit`, `Writer` |
| `bimap` | [`Async`][async-bimap], [`Either`][either-bimap], [`Pair`][pair-bimap], `Result` |
| `both` | [`Arrow`][arrow-both], `Function`, `Star` |
| `chain` | `Array`, [`Async`][async-chain], [`Const`][const-chain], [`Either`][either-chain], `Identity`, `IO`, `List`, [`Maybe`][maybe-chain], [`Pair`][pair-chain], [`Reader`][reader-chain], `Result`, [`State`][state-chain], `Unit`, `Writer` |
| `coalesce` | [`Async`][async-coalesce], [`Either`][either-coalesce], [`Maybe`][maybe-coalesce], `Result` |
| `compareWith` | [`Equiv`][equiv-compare] |
| `concat` | [`All`][all-concat], [`Any`][any-concat], `Array`, [`Assign`][assign-concat], [`Const`][const-concat], [`Either`][either-concat], [`Endo`][endo-concat], [`Equiv`][equiv-concat], [`First`][first-concat], `Identity`, [`Last`][last-concat], `List`, [`Max`][max-concat], [`Maybe`][maybe-concat], [`Min`][min-concat], [`Pair`][pair-concat], [`Pred`][pred-concat], [`Prod`][prod-concat], `Result`, `String`, [`Sum`][sum-concat], [`Tuple`][tuple-concat], `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | [`Arrow`][arrow-contra], [`Equiv`][equiv-contra], [`Pred`][pred-contra], `Star` |
| `either` | [`Either`][either-either], [`Maybe`][maybe-either], `Result` |
| `empty` | [`All`][all-empty], [`Any`][any-empty], `Array`, [`Assign`][assign-empty], [`Endo`][endo-empty], [`Equiv`][equiv-empty], [`First`][first-empty], [`Last`][last-empty], `List`, [`Max`][max-empty], [`Min`][min-empty], `Object`, [`Pred`][pred-empty], [`Prod`][prod-empty], `String`, [`Sum`][sum-empty], `Unit` |
| `equals` | [`All`][all-equals], [`Any`][any-equals], `Array`, [`Assign`][assign-equals], `Boolean`, [`Const`][const-equals], [`Either`][either-equals], [`First`][first-equals], [`Last`][last-equals], `List`, [`Max`][max-equals], [`Maybe`][maybe-equals], [`Min`][min-equals], `Number`, `Object`, [`Pair`][pair-equals], [`Prod`][prod-equals], `Result`, `String`, [`Sum`][sum-equals], [`Tuple`][tuple-equals], `Unit`, `Writer` |
| [`evalWith`][eval] | [`State`][state-eval] |
| [`execWith`][exec] | [`State`][state-exec] |
| `extend` | [`Pair`][pair-extend] |
| `filter` | `Array`, `List`, `Object` |
| `first` | [`Arrow`][arrow-first], `Function`, `Star` |
| `fold` | `Array`, `List` |
| `foldMap` | `Array`, `List` |
| [`fst`][fst] | [`Pair`][pair-fst] |
| `head` | `Array`, `List`, `String` |
| `log` | `Writer` |
| `map` | [`Async`][async-map], `Array`, [`Arrow`][arrow-map], [`Const`][const-map], [`Either`][either-map], `Function`, `Identity`, `IO`, `List`, [`Maybe`][maybe-map], `Object`, [`Pair`][pair-map], [`Reader`][reader-map], `Result`, `Star`, [`State`][state-map], [`Tuple`][tuple-map], `Unit`, `Writer` |
| `merge` | [`Pair`][pair-merge], [`Tuple`][tuple-merge] |
| `option` | [`First`][first-option], [`Last`][last-option], [`Maybe`][maybe-option] |
| `promap` | [`Arrow`][arrow-pro], `Star` |
| [`race`][race] | [`Async`][async-race] |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `reduceRight` | `Array`, `List` |
| `reject` | `Array`, `List`, `Object` |
| `run` | `IO` |
| `runWith` | [`Arrow`][arrow-run], [`Endo`][endo-run], [`Pred`][pred-run], [`Reader`][reader-run], `Star`, [`State`][state-run] |
| `second` | [`Arrow`][arrow-second], `Function`, `Star` |
| `sequence` | `Array`, [`Either`][either-sequence], `Identity`, `List`, [`Maybe`][maybe-sequence], [`Pair`][pair-sequence], `Result` |
| [`snd`][snd] | [`Pair`][pair-snd] |
| `swap` | [`Async`][async-swap], [`Either`][either-swap], [`Pair`][pair-swap], `Result` |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, [`Either`][either-traverse], `Identity`, `List`, [`Maybe`][maybe-traverse], [`Pair`][pair-traverse], `Result` |
| `valueOf` | [`All`][all-value], [`Any`][any-value], [`Assign`][assign-value], [`Const`][const-value], [`Endo`][endo-value], [`Equiv`][equiv-value], [`First`][first-value], `Identity`, [`Last`][last-value], [`Max`][max-value], [`Min`][min-value], [`Pred`][pred-value], [`Prod`][prod-value], [`Sum`][sum-value], `Unit`, `Writer` |

[all-concat]: ../monoids/All.html#concat
[all-empty]: ../monoids/All.html#empty
[all-equals]: ../monoids/All.html#equals
[all-value]: ../monoids/All.html#valueof

[any-concat]: ../monoids/Any.html#concat
[any-empty]: ../monoids/Any.html#empty
[any-equals]: ../monoids/Any.html#equals
[any-value]: ../monoids/Any.html#valueof

[assign-concat]: ../monoids/Assign.html#concat
[assign-empty]: ../monoids/Assign.html#empty
[assign-equals]: ../monoids/Assign.html#equals
[assign-value]: ../monoids/Assign.html#valueof

[arrow-both]: ../crocks/Arrow.html#both
[arrow-contra]: ../crocks/Arrow.html#contramap
[arrow-first]: ../crocks/Arrow.html#first
[arrow-map]: ../crocks/Arrow.html#map
[arrow-pro]: ../crocks/Arrow.html#promap
[arrow-run]: ../crocks/Arrow.html#runwith
[arrow-second]: ../crocks/Arrow.html#second

[async-alt]: ../crocks/Async.html#alt
[async-ap]: ../crocks/Async.html#ap
[async-bimap]: ../crocks/Async.html#bimap
[async-chain]: ../crocks/Async.html#chain
[async-coalesce]: ../crocks/Async.html#coalesce
[async-map]: ../crocks/Async.html#map
[async-swap]: ../crocks/Async.html#swap
[async-race]: ../crocks/Async.html#race

[const-ap]: ../crocks/Const.html#ap
[const-chain]: ../crocks/Const.html#chain
[const-concat]: ../crocks/Const.html#concat
[const-equals]: ../crocks/Const.html#equals
[const-map]: ../crocks/Const.html#map
[const-value]: ../crocks/Const.html#valueof

[endo-concat]: ../monoids/Endo.html#concat
[endo-empty]: ../monoids/Endo.html#empty
[endo-run]: ../monoids/Endo.html#runwith
[endo-value]: ../monoids/Endo.html#valueof

[either-alt]: ../crocks/Either.html#alt
[either-ap]: ../crocks/Either.html#ap
[either-bimap]: ../crocks/Either.html#bimap
[either-chain]: ../crocks/Either.html#chain
[either-coalesce]: ../crocks/Either.html#coalesce
[either-concat]: ../crocks/Either.html#concat
[either-either]: ../crocks/Either.html#either
[either-equals]: ../crocks/Either.html#equals
[either-map]: ../crocks/Either.html#map
[either-sequence]: ../crocks/Either.html#sequence
[either-swap]: ../crocks/Either.html#swap
[either-traverse]: ../crocks/Either.html#traverse

[equiv-compare]: ../crocks/Equiv.html#comparewith
[equiv-concat]: ../crocks/Equiv.html#concat
[equiv-contra]: ../crocks/Equiv.html#contramap
[equiv-empty]: ../crocks/Equiv.html#empty
[equiv-value]: ../crocks/Equiv.html#valueof

[first-concat]: ../monoids/First.html#concat
[first-empty]: ../monoids/First.html#empty
[first-equals]: ../monoids/First.html#equals
[first-option]: ../monoids/First.html#option
[first-value]: ../monoids/First.html#valueof

[last-concat]: ../monoids/Last.html#concat
[last-empty]: ../monoids/Last.html#empty
[last-equals]: ../monoids/Last.html#equals
[last-option]: ../monoids/Last.html#option
[last-value]: ../monoids/Last.html#valueof

[max-concat]: ../monoids/Max.html#concat
[max-empty]: ../monoids/Max.html#empty
[max-equals]: ../monoids/Max.html#equals
[max-value]: ../monoids/Max.html#valueof

[maybe-alt]: ../crocks/Maybe.html#alt
[maybe-ap]: ../crocks/Maybe.html#ap
[maybe-chain]: ../crocks/Maybe.html#chain
[maybe-coalesce]: ../crocks/Maybe.html#coalesce
[maybe-concat]: ../crocks/Maybe.html#concat
[maybe-either]: ../crocks/Maybe.html#either
[maybe-equals]: ../crocks/Maybe.html#equals
[maybe-map]: ../crocks/Maybe.html#map
[maybe-option]: ../crocks/Maybe.html#option
[maybe-sequence]: ../crocks/Maybe.html#sequence
[maybe-traverse]: ../crocks/Maybe.html#traverse

[min-concat]: ../monoids/Min.html#concat
[min-empty]: ../monoids/Min.html#empty
[min-equals]: ../monoids/Min.html#equals
[min-value]: ../monoids/Min.html#valueof

[pair-ap]: ../crocks/Pair.html#ap
[pair-bimap]: ../crocks/Pair.html#bimap
[pair-concat]: ../crocks/Pair.html#concat
[pair-chain]: ../crocks/Pair.html#chain
[pair-equals]: ../crocks/Pair.html#equals
[pair-extend]: ../crocks/Pair.html#extend
[pair-fst]: ../crocks/Pair.html#fst
[pair-map]: ../crocks/Pair.html#map
[pair-merge]: ../crocks/Pair.html#merge
[pair-sequence]: ../crocks/Pair.html#sequence
[pair-snd]: ../crocks/Pair.html#snd
[pair-swap]: ../crocks/Pair.html#swap
[pair-traverse]: ../crocks/Pair.html#traverse

[pred-concat]: ../crocks/Pred.html#concat
[pred-contra]: ../crocks/Pred.html#contramap
[pred-empty]: ../crocks/Pred.html#empty
[pred-run]: ../crocks/Pred.html#runwith
[pred-value]: ../crocks/Pred.html#valueof

[prod-concat]: ../monoids/Prod.html#concat
[prod-empty]: ../monoids/Prod.html#empty
[prod-equals]: ../monoids/Prod.html#equals
[prod-value]: ../monoids/Prod.html#valueof

[sum-concat]: ../monoids/Sum.html#concat
[sum-empty]: ../monoids/Sum.html#empty
[sum-equals]: ../monoids/Sum.html#equals
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

[tuple-concat]: ../crocks/Tuple.html#concat
[tuple-equals]: ../crocks/Tuple.html#equals
[tuple-map]: ../crocks/Tuple.html#map
[tuple-merge]: ../crocks/Tuple.html#merge

[exec]: ../crocks/State.html#execwith-pointfree
[eval]: ../crocks/State.html#evalwith-pointfree

[fst]: ../crocks/Pair.html#fst-pointfree
[nmap]: ../crocks/Tuple.html#nmap
[snd]: ../crocks/Pair.html#snd-pointfree

[race]: ../crocks/Async.html#race-pointfree
