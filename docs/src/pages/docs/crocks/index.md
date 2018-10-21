---
title: "Crocks"
description: "Crocks API"
layout: "notopic"
icon: "code-file"
weight: 2
---

The `crocks` are the heart and soul of this library. This is where you will find
all your favorite ADT's you have grown to love. They include gems such as:
[`Maybe`][maybe], [`Either`][either] and `IO`, to name a few. They are usually
just a simple constructor that takes either a function or value (depending on
the type) and will return you a "container" that wraps whatever you passed it.
Each container provides a variety of functions that act as the operations you
can do on the contained value. There are many types that share the same function
names, but what they do from type to type may vary.

| Crock | Constructor | Instance |
|---|:---|:---|
| [`Arrow`][arrow] | [`id`][arrow-id] | [`both`][arrow-both], [`compose`][arrow-compose], [`contramap`][arrow-contra],[`first`][arrow-first], [`map`][arrow-map], [`promap`][arrow-promap], [`runWith`][arrow-runwith], [`second`][arrow-second] |
| [`Async`][async] | [`Rejected`][async-rejected], [`Resolved`][async-resolved], [`all`][async-all], [`resolveAfter`][async-resolveAfter], [`rejectAfter`][async-rejectafter], [`fromNode`][async-fromnode], [`fromPromise`][async-frompromise], [`of`][async-of] | [`alt`][async-alt], [`ap`][async-ap], [`bimap`][async-bimap], [`chain`][async-chain], [`coalesce`][async-coalesce], [`race`][async-race], [`fork`][async-fork], [`map`][async-map], [`of`][async-of], [`swap`][async-swap], [`toPromise`][async-topromise] |
| [`Const`][const] | -- | [`ap`][const-ap], [`chain`][const-chain], [`concat`][const-concat], [`equals`][const-equals], [`map`][const-map], [`valueOf`][const-valueof] |
| [`Either`][either] | [`Left`][either-left], [`Right`][either-right], [`of`][either-of]| [`alt`][either-alt], [`ap`][either-ap], [`bimap`][either-bimap], [`chain`][either-chain], [`coalesce`][either-coalesce], [`concat`][either-concat], [`either`][either-either], [`equals`][either-equals], [`map`][either-map], [`of`][either-of], [`sequence`][either-sequence], [`swap`][either-swap], [`traverse`][either-traverse] |
| [`Equiv`][equiv] | [`empty`][equiv-empty] | [`concat`][equiv-concat], [`contramap`][equiv-contra], [`compareWith`][equiv-compare], [`valueOf`][equiv-value] |
| `Identity` | `of` | `ap`, `chain`, `concat`, `equals`, `map`, `of`, `sequence`, `traverse`, `valueOf` |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `fromArray`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `fold`, `foldMap`, `head`, `map`, `of`, `reduce`, `reduceRight`, `reject`, `sequence`, `tail`, `toArray`, `traverse`, `valueOf` |
| [`Maybe`][maybe] | [`Nothing`][maybe-nothing], [`Just`][maybe-just], [`of`][maybe-of], [`zero`][maybe-zero] | [`alt`][maybe-alt], [`ap`][maybe-ap], [`chain`][maybe-chain], [`coalesce`][maybe-coalesce], [`concat`][maybe-concat], [`equals`][maybe-equals], [`either`][maybe-either], [`map`][maybe-map], [`of`][maybe-of], [`option`][maybe-option], [`sequence`][maybe-sequence], [`traverse`][maybe-traverse], [`zero`][maybe-zero] |
| [`Pair`][pair] | --- | [`ap`][pair-ap], [`bimap`][pair-bimap], [`chain`][pair-chain], [`concat`][pair-concat], [`equals`][pair-equals], [`extend`][pair-extend], [`fst`][pair-fst], [`map`][pair-map], [`merge`][pair-merge], [`sequence`][pair-sequence], [`snd`][pair-snd], [`swap`][pair-swap], [`traverse`][pair-traverse], [`toArray`][pair-toarray] |
| [`Pred`][pred] * | [`empty`][pred-empty] | [`concat`][pred-concat], [`contramap`][pred-contra], [`runWith`][pred-run], [`valueOf`][pred-value] |
| [`Reader`][reader] | [`ask`][reader-ask], [`of`][reader-of] | [`ap`][reader-ap], [`chain`][reader-chain], [`map`][reader-map], [`runWith`][reader-run] |
| [`ReaderT`][readert] | [`ask`][readert-ask], [`lift`][readert-lift], [`liftFn`][readert-liftfn], [`of`][readert-of] | [`ap`][readert-ap], [`chain`][readert-chain], [`map`][readert-map], [`runWith`][readert-run] |
| `Result` | `Err`, `Ok`, `of`| `alt`, `ap`, `bimap`, `chain`, `coalesce`, `concat`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse` |
| `Star` | `id` | `both`, `compose`, `contramap`, `map`, `promap`, `runWith` |
| [`State`][state] | [`get`][state-get], [`modify`][state-modify], [`of`][state-of], [`put`][state-put] | [`ap`][state-ap], [`chain`][state-chain], [`evalWith`][state-eval], [`execWith`][state-exec], [`map`][state-map], [`runWith`][state-run] |
| [`Tuple`][tuple] | --- | [`concat`][tuple-concat], [`equals`][tuple-equals], [`map`][tuple-map], [`mapAll`][tuple-mapall], [`merge`][tuple-merge], [`project`][tuple-project], [`toArray`][tuple-toarray] |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `valueOf` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `valueOf` |

\* based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)

[arrow]: Arrow.html
[arrow-id]: Arrow.html#id
[arrow-both]: Arrow.html#both
[arrow-compose]: Arrow.html#compose
[arrow-contra]: Arrow.html#contramap
[arrow-first]: Arrow.html#first
[arrow-map]: Arrow.html#map
[arrow-promap]: Arrow.html#promap
[arrow-runwith]: Arrow.html#runwith
[arrow-second]: Arrow.html#second

[async]: Async.html
[async-rejected]: Async.html#rejected
[async-resolved]: Async.html#resolved
[async-all]: Async.html#all
[async-resolveafter]: Async.html#resolveafter
[async-rejectafter]: Async.html#rejectafter
[async-fromnode]: Async.html#fromnode
[async-frompromise]: Async.html#frompromise
[async-of]: Async.html#of
[async-alt]: Async.html#alt
[async-ap]: Async.html#ap
[async-bimap]: Async.html#bimap
[async-chain]: Async.html#chain
[async-coalesce]: Async.html#coalesce
[async-race]: Async.html#race
[async-fork]: Async.html#fork
[async-map]: Async.html#map
[async-swap]: Async.html#swap
[async-topromise]: Async.html#topromise

[const]: Const.html
[const-equals]: Const.html#equals
[const-concat]: Const.html#concat
[const-map]: Const.html#map
[const-ap]: Const.html#ap
[const-chain]: Const.html#chain
[const-valueof]: Const.html#valueof

[either]: Either.html
[either-left]: Either.html#left
[either-right]: Either.html#right
[either-of]: Either.html#of
[either-alt]: Either.html#alt
[either-ap]: Either.html#ap
[either-bimap]: Either.html#bimap
[either-chain]: Either.html#chain
[either-coalesce]: Either.html#coalesce
[either-concat]: Either.html#concat
[either-either]: Either.html#either
[either-equals]: Either.html#equals
[either-map]: Either.html#map
[either-sequence]: Either.html#sequence
[either-swap]: Either.html#swap
[either-traverse]: Either.html#traverse

[equiv]: Equiv.html
[equiv-empty]: Equiv.html#empty
[equiv-concat]: Equiv.html#concat
[equiv-contra]: Equiv.html#contramap
[equiv-compare]: Equiv.html#comparewith
[equiv-value]: Equiv.html#valueof

[pair]: Pair.html
[pair-ap]: Pair.html#ap
[pair-bimap]: Pair.html#bimap
[pair-chain]: Pair.html#chain
[pair-concat]: Pair.html#concat
[pair-equals]: Pair.html#equals
[pair-extend]: Pair.html#extend
[pair-fst]: Pair.html#fst
[pair-map]: Pair.html#map
[pair-merge]: Pair.html#merge
[pair-sequence]: Pair.html#sequence
[pair-snd]: Pair.html#snd
[pair-swap]: Pair.html#swap
[pair-traverse]: Pair.html#traverse
[pair-toarray]: Pair.html#toarray

[pred]: Pred.html
[pred-empty]: Pred.html#empty
[pred-concat]: Pred.html#concat
[pred-contra]: Pred.html#contramap
[pred-run]: Pred.html#runwith
[pred-value]: Pred.html#valueof

[maybe]: Maybe.html
[maybe-nothing]: Maybe.html#nothing
[maybe-just]: Maybe.html#just
[maybe-of]: Maybe.html#of
[maybe-zero]: Maybe.html#zero
[maybe-alt]: Maybe.html#alt
[maybe-ap]: Maybe.html#ap
[maybe-chain]: Maybe.html#chain
[maybe-coalesce]: Maybe.html#coalesce
[maybe-concat]: Maybe.html#concat
[maybe-equals]: Maybe.html#equals
[maybe-either]: Maybe.html#either
[maybe-map]: Maybe.html#map
[maybe-option]: Maybe.html#option
[maybe-sequence]: Maybe.html#sequence
[maybe-traverse]: Maybe.html#traverse
[maybe-zero]: Maybe.html#zero

[reader]: Reader.html
[reader-ask]: Reader.html#ask
[reader-of]: Reader.html#of
[reader-ap]: Reader.html#ap
[reader-chain]: Reader.html#chain
[reader-map]: Reader.html#map
[reader-run]: Reader.html#runwith

[readert]: ReaderT.html
[readert-ask]: ReaderT.html#ask
[readert-lift]: ReaderT.html#lift
[readert-liftfn]: ReaderT.html#liftfn
[readert-of]: ReaderT.html#of
[readert-ap]: ReaderT.html#ap
[readert-chain]: ReaderT.html#chain
[readert-map]: ReaderT.html#map
[readert-run]: ReaderT.html#runwith

[state]: State.html
[state-get]: State.html#get
[state-modify]: State.html#modify
[state-put]: State.html#put
[state-of]: State.html#of
[state-ap]: State.html#ap
[state-chain]: State.html#chain
[state-map]: State.html#map
[state-run]: State.html#runwith
[state-eval]: State.html#evalwith
[state-exec]: State.html#execwith

[tuple]: Tuple.html
[tuple-concat]: Tuple.html#concat
[tuple-equals]: Tuple.html#equals
[tuple-map]: Tuple.html#map
[tuple-mapall]: Tuple.html#mapall
[tuple-merge]: Tuple.html#merge
[tuple-project]: Tuple.html#project
[tuple-toarray]: Tuple.html#toarray
