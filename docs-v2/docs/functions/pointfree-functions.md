---
title: "Point-free Functions"
description: "Point-free Functions API"
layout: "notopic"
functions: ["alt", "ap", "bichain", "bimap", "both", "chain", "coalesce", "comparewith", "concat", "cons", "contramap", "either", "empty", "equals", "extend", "filter", "first", "fold", "foldmap", "head", "init", "last", "map", "merge", "option", "promap", "race", "reduce", "reduceright", "run", "runwith", "second", "sequence", "swap", "tail", "traverse", "valueof"]
weight: 50
---

While it can seem natural to work with all these containers in a fluent fashion,
it can get cumbersome and hard to get a lot of reuse out of. A way to really get
the most out of re-usability in JavaScript is to take what is called a point-free
approach. Below is a small code same to contrast the difference between the two
calling styles:

```js runkit
import map from 'crocks/pointfree/map'

import compose from 'crocks/helpers/compose'
import isInteger from 'crocks/predicates/isInteger'
import safe from 'crocks/Maybe/safe'

// isEven :: Integer -> Boolean
const isEven = x =>
  x % 2 === 0

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

fluentIsEven(5)
//=> Just false

fluentIsEven('number')
//=> Nothing

fluentIsEven(6)
//=> Just true

pointfreeIsEven(5)
//=> Just false

pointfreeIsEven('not even')
//=> Nothing

pointfreeIsEven(6)
//=> Just true
```

These functions provide a very clean way to build out very simple functions and
compose them all together to compose a more complicated flow. Each point-free
function provided in `crocks` is "auto-curried" and follows a "data-last"
pattern in the order of how it receives it's arguments. Typically the most
stable of the arguments comes first, moving all the way to the least stable
argument (which usually is the data flowing through your composition). Below
lists the provided functions and the data types they work with (`m` refers to an
accepted Datatype):

#### Signatures
| Function | Signature | Location |
|---|:---|:---|
| `alt` | `m a -> m a -> m a` | `crocks/pointfree` |
| `ap` | `m a -> m (a -> b) -> m b` | `crocks/pointfree` |
| `bichain` | `(a -> m c d) -> (b -> m c d) -> m a b -> m c d` | `crocks/pointfree` |
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
| `init` | `m a -> Maybe (m a)` | `crocks/pointfree` |
| `last` | `m a -> Maybe a` | `crocks/pointfree` |
| `log` | `m a b -> a` | `crocks/Writer` |
| `map` | `(a -> b) -> m a -> m b` | `crocks/pointfree` |
| `merge` | `(a -> b -> c) -> m a b -> c` | `crocks/pointfree` |
| [`nmap`][nmap] | `Integer -> ...(* -> *) m ...* -> m ...*` | `crocks/Tuple` |
| `option` | `a -> m a -> a` | `crocks/pointfree` |
| [`project`][project] | `Integer -> m ...* -> a` | `crocks/Tuple` |
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

#### Datatypes
| Function | Datatypes |
|---|:---|
| `alt` | [`Async`][async-alt], [`Either`][either-alt], [`Maybe`][maybe-alt], [`Result`][result-alt] |
| `ap` | `Array`, [`Async`][async-ap], [`Const`][const-ap], [`Either`][either-ap], `Identity`, `IO`, `List`, [`Maybe`][maybe-ap], [`Pair`][pair-ap], [`Reader`][reader-ap], [`Result`][result-ap], [`State`][state-ap], `Unit`, `Writer` |
| `bichain` | [`Async`][async-bichain], [`Either`][either-bichain], [`Maybe`][maybe-bichain], [`Result`][result-bichain] |
| `bimap` | [`Async`][async-bimap], [`Either`][either-bimap], [`Pair`][pair-bimap], [`Result`][result-bimap] |
| `both` | [`Arrow`][arrow-both], `Function`, `Star` |
| `chain` | `Array`, [`Async`][async-chain], [`Const`][const-chain], [`Either`][either-chain], `Identity`, `IO`, `List`, [`Maybe`][maybe-chain], [`Pair`][pair-chain], [`Reader`][reader-chain], [`Result`][result-chain], [`State`][state-chain], `Unit`, `Writer` |
| `coalesce` | [`Async`][async-coalesce], [`Either`][either-coalesce], [`Maybe`][maybe-coalesce], [`Result`][result-coalesce] |
| `compareWith` | [`Equiv`][equiv-compare] |
| `concat` | [`All`][all-concat], [`Any`][any-concat], `Array`, [`Assign`][assign-concat], [`Const`][const-concat], [`Either`][either-concat], [`Endo`][endo-concat], [`Equiv`][equiv-concat], [`First`][first-concat], `Identity`, [`Last`][last-concat], `List`, [`Max`][max-concat], [`Maybe`][maybe-concat], [`Min`][min-concat], [`Pair`][pair-concat], [`Pred`][pred-concat], [`Prod`][prod-concat], [`Result`][result-concat], `String`, [`Sum`][sum-concat], [`Tuple`][tuple-concat], `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | [`Arrow`][arrow-contra], [`Equiv`][equiv-contra], [`Pred`][pred-contra], `Star` |
| `either` | [`Either`][either-either], [`Maybe`][maybe-either], [`Result`][result-either] |
| `empty` | [`All`][all-empty], [`Any`][any-empty], `Array`, [`Assign`][assign-empty], [`Endo`][endo-empty], [`Equiv`][equiv-empty], [`First`][first-empty], [`Last`][last-empty], `List`, [`Max`][max-empty], [`Min`][min-empty], `Object`, [`Pred`][pred-empty], [`Prod`][prod-empty], `String`, [`Sum`][sum-empty], `Unit` |
| `equals` | [`All`][all-equals], [`Any`][any-equals], `Array`, [`Assign`][assign-equals], `Boolean`, [`Const`][const-equals], [`Either`][either-equals], [`First`][first-equals], [`Last`][last-equals], `List`, [`Max`][max-equals], [`Maybe`][maybe-equals], [`Min`][min-equals], `Number`, `Object`, [`Pair`][pair-equals], [`Prod`][prod-equals], [`Result`][result-equals], `String`, [`Sum`][sum-equals], [`Tuple`][tuple-equals], `Unit`, `Writer` |
| [`evalWith`][eval] | [`State`][state-eval] |
| [`execWith`][exec] | [`State`][state-exec] |
| `extend` | [`Pair`][pair-extend] |
| `filter` | `Array`, `List`, `Object` |
| `first` | [`Arrow`][arrow-first], `Function`, `Star` |
| `fold` | `Array`, `List` |
| `foldMap` | `Array`, `List` |
| [`fst`][fst] | [`Pair`][pair-fst] |
| `head` | `Array`, `List`, `String` |
| `init` | `Array`, `List`, `String` |
| `last` | `Array`, `List`, `String` |
| `log` | `Writer` |
| `map` | [`Async`][async-map], `Array`, [`Arrow`][arrow-map], [`Const`][const-map], [`Either`][either-map], `Function`, `Identity`, `IO`, `List`, [`Maybe`][maybe-map], `Object`, [`Pair`][pair-map], [`Reader`][reader-map], [`Result`][result-map], `Star`, [`State`][state-map], [`Tuple`][tuple-map], `Unit`, `Writer` |
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
| `sequence` | `Array`, [`Either`][either-sequence], `Identity`, `List`, [`Maybe`][maybe-sequence], [`Pair`][pair-sequence], [`Result`][result-sequence] |
| [`snd`][snd] | [`Pair`][pair-snd] |
| `swap` | [`Async`][async-swap], [`Either`][either-swap], [`Pair`][pair-swap], [`Result`][result-swap] |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, [`Either`][either-traverse], `Identity`, `List`, [`Maybe`][maybe-traverse], [`Pair`][pair-traverse], [`Result`][result-traverse] |
| `valueOf` | [`All`][all-value], [`Any`][any-value], [`Assign`][assign-value], [`Const`][const-value], [`Endo`][endo-value], [`Equiv`][equiv-value], [`First`][first-value], `Identity`, [`Last`][last-value], [`Max`][max-value], [`Min`][min-value], [`Pred`][pred-value], [`Prod`][prod-value], [`Sum`][sum-value], `Unit`, `Writer` |

[all-concat]: ../monoids/All#concat
[all-empty]: ../monoids/All#empty
[all-equals]: ../monoids/All#equals
[all-value]: ../monoids/All#valueof

[any-concat]: ../monoids/Any#concat
[any-empty]: ../monoids/Any#empty
[any-equals]: ../monoids/Any#equals
[any-value]: ../monoids/Any#valueof

[assign-concat]: ../monoids/Assign#concat
[assign-empty]: ../monoids/Assign#empty
[assign-equals]: ../monoids/Assign#equals
[assign-value]: ../monoids/Assign#valueof

[arrow-both]: ../crocks/Arrow#both
[arrow-contra]: ../crocks/Arrow#contramap
[arrow-first]: ../crocks/Arrow#first
[arrow-map]: ../crocks/Arrow#map
[arrow-pro]: ../crocks/Arrow#promap
[arrow-run]: ../crocks/Arrow#runwith
[arrow-second]: ../crocks/Arrow#second

[async-alt]: ../crocks/Async#alt
[async-ap]: ../crocks/Async#ap
[async-bichain]: ../crocks/Async#bichain
[async-bimap]: ../crocks/Async#bimap
[async-chain]: ../crocks/Async#chain
[async-coalesce]: ../crocks/Async#coalesce
[async-map]: ../crocks/Async#map
[async-swap]: ../crocks/Async#swap
[async-race]: ../crocks/Async#race

[const-ap]: ../crocks/Const#ap
[const-chain]: ../crocks/Const#chain
[const-concat]: ../crocks/Const#concat
[const-equals]: ../crocks/Const#equals
[const-map]: ../crocks/Const#map
[const-value]: ../crocks/Const#valueof

[endo-concat]: ../monoids/Endo#concat
[endo-empty]: ../monoids/Endo#empty
[endo-run]: ../monoids/Endo#runwith
[endo-value]: ../monoids/Endo#valueof

[either-alt]: ../crocks/Either#alt
[either-ap]: ../crocks/Either#ap
[either-bichain]: ../crocks/Either#bichain
[either-bimap]: ../crocks/Either#bimap
[either-chain]: ../crocks/Either#chain
[either-coalesce]: ../crocks/Either#coalesce
[either-concat]: ../crocks/Either#concat
[either-either]: ../crocks/Either#either
[either-equals]: ../crocks/Either#equals
[either-map]: ../crocks/Either#map
[either-sequence]: ../crocks/Either#sequence
[either-swap]: ../crocks/Either#swap
[either-traverse]: ../crocks/Either#traverse

[equiv-compare]: ../crocks/Equiv#comparewith
[equiv-concat]: ../crocks/Equiv#concat
[equiv-contra]: ../crocks/Equiv#contramap
[equiv-empty]: ../crocks/Equiv#empty
[equiv-value]: ../crocks/Equiv#valueof

[first-concat]: ../monoids/First#concat
[first-empty]: ../monoids/First#empty
[first-equals]: ../monoids/First#equals
[first-option]: ../monoids/First#option
[first-value]: ../monoids/First#valueof

[last-concat]: ../monoids/Last#concat
[last-empty]: ../monoids/Last#empty
[last-equals]: ../monoids/Last#equals
[last-option]: ../monoids/Last#option
[last-value]: ../monoids/Last#valueof

[max-concat]: ../monoids/Max#concat
[max-empty]: ../monoids/Max#empty
[max-equals]: ../monoids/Max#equals
[max-value]: ../monoids/Max#valueof

[maybe-alt]: ../crocks/Maybe#alt
[maybe-ap]: ../crocks/Maybe#ap
[maybe-bichain]: ../crocks/Maybe#bichain
[maybe-chain]: ../crocks/Maybe#chain
[maybe-coalesce]: ../crocks/Maybe#coalesce
[maybe-concat]: ../crocks/Maybe#concat
[maybe-either]: ../crocks/Maybe#either
[maybe-equals]: ../crocks/Maybe#equals
[maybe-map]: ../crocks/Maybe#map
[maybe-option]: ../crocks/Maybe#option
[maybe-sequence]: ../crocks/Maybe#sequence
[maybe-traverse]: ../crocks/Maybe#traverse

[min-concat]: ../monoids/Min#concat
[min-empty]: ../monoids/Min#empty
[min-equals]: ../monoids/Min#equals
[min-value]: ../monoids/Min#valueof

[pair-ap]: ../crocks/Pair#ap
[pair-bimap]: ../crocks/Pair#bimap
[pair-concat]: ../crocks/Pair#concat
[pair-chain]: ../crocks/Pair#chain
[pair-equals]: ../crocks/Pair#equals
[pair-extend]: ../crocks/Pair#extend
[pair-fst]: ../crocks/Pair#fst
[pair-map]: ../crocks/Pair#map
[pair-merge]: ../crocks/Pair#merge
[pair-sequence]: ../crocks/Pair#sequence
[pair-snd]: ../crocks/Pair#snd
[pair-swap]: ../crocks/Pair#swap
[pair-traverse]: ../crocks/Pair#traverse

[pred-concat]: ../crocks/Pred#concat
[pred-contra]: ../crocks/Pred#contramap
[pred-empty]: ../crocks/Pred#empty
[pred-run]: ../crocks/Pred#runwith
[pred-value]: ../crocks/Pred#valueof

[prod-concat]: ../monoids/Prod#concat
[prod-empty]: ../monoids/Prod#empty
[prod-equals]: ../monoids/Prod#equals
[prod-value]: ../monoids/Prod#valueof

[sum-concat]: ../monoids/Sum#concat
[sum-empty]: ../monoids/Sum#empty
[sum-equals]: ../monoids/Sum#equals
[sum-value]: ../monoids/Sum#valueof

[reader-ap]: ../crocks/Reader#ap
[reader-chain]: ../crocks/Reader#chain
[reader-map]: ../crocks/Reader#map
[reader-run]: ../crocks/Reader#runwith

[result-alt]: ../crocks/Result#alt
[result-ap]: ../crocks/Result#ap
[result-bichain]: ../crocks/Result#bichain
[result-bimap]: ../crocks/Result#bimap
[result-chain]: ../crocks/Result#chain
[result-coalesce]: ../crocks/Result#coalesce
[result-concat]: ../crocks/Result#concat
[result-either]: ../crocks/Result#either
[result-equals]: ../crocks/Result#equals
[result-map]: ../crocks/Result#map
[result-sequence]: ../crocks/Result#sequence
[result-swap]: ../crocks/Result#swap
[result-traverse]: ../crocks/Result#traverse

[state-ap]: ../crocks/State#ap
[state-chain]: ../crocks/State#chain
[state-eval]: ../crocks/State#evalwith
[state-exec]: ../crocks/State#execwith
[state-map]: ../crocks/State#map
[state-run]: ../crocks/State#runwith

[tuple-concat]: ../crocks/Tuple#concat
[tuple-equals]: ../crocks/Tuple#equals
[tuple-map]: ../crocks/Tuple#map
[tuple-merge]: ../crocks/Tuple#merge

[exec]: ../crocks/State#execwith-pointfree
[eval]: ../crocks/State#evalwith-pointfree

[fst]: ../crocks/Pair#fst-pointfree
[nmap]: ../crocks/Tuple#nmap
[project]: ../crocks/Tuple#project
[snd]: ../crocks/Pair#snd-pointfree

[race]: ../crocks/Async#race-pointfree
