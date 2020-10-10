---
title: "Crocks"
description: "Crocks API"
layout: "notopic"
icon: "code-file"
weight: 2
slug: /crocks/
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
| [`Async`][async] | [`Rejected`][async-rejected], [`Resolved`][async-resolved], [`all`][async-all], [`resolveAfter`][async-resolveAfter], [`rejectAfter`][async-rejectafter], [`fromNode`][async-fromnode], [`fromPromise`][async-frompromise], [`of`][async-of] | [`alt`][async-alt], [`ap`][async-ap], [`bichain`][async-bichain], [`bimap`][async-bimap], [`chain`][async-chain], [`coalesce`][async-coalesce], [`fork`][async-fork], [`map`][async-map], [`of`][async-of], [`race`][async-race], [`swap`][async-swap], [`toPromise`][async-topromise] |
| [`Const`][const] | [`empty`][const-empty], [`of`][const-of] | [`ap`][const-ap], [`concat`][const-concat], [`empty`][const-empty], [`equals`][const-equals], [`map`][const-map], [`of`][const-of], [`valueOf`][const-valueof] |
| [`Either`][either] | [`Left`][either-left], [`Right`][either-right], [`of`][either-of]| [`alt`][either-alt], [`ap`][either-ap], [`bichain`][either-bichain], [`bimap`][either-bimap], [`chain`][either-chain], [`coalesce`][either-coalesce], [`concat`][either-concat], [`either`][either-either], [`equals`][either-equals], [`map`][either-map], [`of`][either-of], [`sequence`][either-sequence], [`swap`][either-swap], [`traverse`][either-traverse] |
| [`Equiv`][equiv] | [`empty`][equiv-empty] | [`concat`][equiv-concat], [`contramap`][equiv-contra], [`compareWith`][equiv-compare], [`valueOf`][equiv-value] |
| [`Identity`][identity] | [`of`][identity-of] | [`ap`][identity-ap], [`chain`][identity-chain], [`concat`][identity-concat], [`equals`][identity-equals], [`map`][identity-map], [`of`][identity-of], [`sequence`][identity-sequence], [`traverse`][identity-traverse], [`valueOf`][identity-valueof] |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `fromArray`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `fold`, `foldMap`, `head`, `init`, `last`, `map`, `of`, `reduce`, `reduceRight`, `reject`, `sequence`, `tail`, `toArray`, `traverse`, `valueOf` |
| [`Maybe`][maybe] | [`Nothing`][maybe-nothing], [`Just`][maybe-just], [`of`][maybe-of], [`zero`][maybe-zero] | [`alt`][maybe-alt], [`ap`][maybe-ap], [`bichain`][maybe-bichain], [`chain`][maybe-chain], [`coalesce`][maybe-coalesce], [`concat`][maybe-concat], [`equals`][maybe-equals], [`either`][maybe-either], [`map`][maybe-map], [`of`][maybe-of], [`option`][maybe-option], [`sequence`][maybe-sequence], [`traverse`][maybe-traverse], [`zero`][maybe-zero] |
| [`Pair`][pair] | --- | [`ap`][pair-ap], [`bimap`][pair-bimap], [`chain`][pair-chain], [`concat`][pair-concat], [`equals`][pair-equals], [`extend`][pair-extend], [`fst`][pair-fst], [`map`][pair-map], [`merge`][pair-merge], [`sequence`][pair-sequence], [`snd`][pair-snd], [`swap`][pair-swap], [`traverse`][pair-traverse], [`toArray`][pair-toarray] |
| [`Pred`][pred] * | [`empty`][pred-empty] | [`concat`][pred-concat], [`contramap`][pred-contra], [`runWith`][pred-run], [`valueOf`][pred-value] |
| [`Reader`][reader] | [`ask`][reader-ask], [`of`][reader-of] | [`ap`][reader-ap], [`chain`][reader-chain], [`map`][reader-map], [`runWith`][reader-run] |
| [`ReaderT`][readert] | [`ask`][readert-ask], [`lift`][readert-lift], [`liftFn`][readert-liftfn], [`of`][readert-of] | [`ap`][readert-ap], [`chain`][readert-chain], [`map`][readert-map], [`runWith`][readert-run] |
| [`Result`][result] | [`Err`][result-err], [`Ok`][result-ok], [`of`][result-of]| [`alt`][result-alt], [`ap`][result-ap], [`bichain`][result-bichain], [`bimap`][result-bimap], [`chain`][result-chain], [`coalesce`][result-coalesce], [`concat`][result-concat], [`either`][result-either], [`equals`][result-equals], [`map`][result-map], [`of`][result-of], [`sequence`][result-sequence], [`swap`][result-swap], [`traverse`][result-traverse] |
| `Star` | `id` | `both`, `compose`, `contramap`, `map`, `promap`, `runWith` |
| [`State`][state] | [`get`][state-get], [`modify`][state-modify], [`of`][state-of], [`put`][state-put] | [`ap`][state-ap], [`chain`][state-chain], [`evalWith`][state-eval], [`execWith`][state-exec], [`map`][state-map], [`runWith`][state-run] |
| [`Tuple`][tuple] | --- | [`concat`][tuple-concat], [`equals`][tuple-equals], [`map`][tuple-map], [`mapAll`][tuple-mapall], [`merge`][tuple-merge], [`project`][tuple-project], [`toArray`][tuple-toarray] |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `valueOf` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `valueOf` |

\* based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)

[arrow]: Arrow
[arrow-id]: Arrow#id
[arrow-both]: Arrow#both
[arrow-compose]: Arrow#compose
[arrow-contra]: Arrow#contramap
[arrow-first]: Arrow#first
[arrow-map]: Arrow#map
[arrow-promap]: Arrow#promap
[arrow-runwith]: Arrow#runwith
[arrow-second]: Arrow#second

[async]: Async
[async-rejected]: Async#rejected
[async-resolved]: Async#resolved
[async-all]: Async#all
[async-resolveafter]: Async#resolveafter
[async-rejectafter]: Async#rejectafter
[async-fromnode]: Async#fromnode
[async-frompromise]: Async#frompromise
[async-of]: Async#of
[async-alt]: Async#alt
[async-ap]: Async#ap
[async-bimap]: Async#bimap
[async-chain]: Async#chain
[async-coalesce]: Async#coalesce
[async-bichain]: Async#bichain
[async-race]: Async#race
[async-fork]: Async#fork
[async-map]: Async#map
[async-swap]: Async#swap
[async-topromise]: Async#topromise

[const]: Const
[const-equals]: Const#equals
[const-concat]: Const#concat
[const-empty]: Const#empty
[const-map]: Const#map
[const-ap]: Const#ap
[const-of]: Const#of
[const-valueof]: Const#valueof

[either]: Either
[either-left]: Either#left
[either-right]: Either#right
[either-of]: Either#of
[either-alt]: Either#alt
[either-ap]: Either#ap
[either-bichain]: Either#bichain
[either-bimap]: Either#bimap
[either-chain]: Either#chain
[either-coalesce]: Either#coalesce
[either-concat]: Either#concat
[either-either]: Either#either
[either-equals]: Either#equals
[either-map]: Either#map
[either-sequence]: Either#sequence
[either-swap]: Either#swap
[either-traverse]: Either#traverse

[identity]: Identity
[identity-of]: Identity#of
[identity-alt]: Identity#alt
[identity-ap]: Identity#ap
[identity-chain]: Identity#chain
[identity-concat]: Identity#concat
[identity-equals]: Identity#equals
[identity-map]: Identity#map
[identity-sequence]: Identity#sequence
[identity-traverse]: Identity#traverse
[identity-valueof]: Identity#valueof

[equiv]: Equiv
[equiv-empty]: Equiv#empty
[equiv-concat]: Equiv#concat
[equiv-contra]: Equiv#contramap
[equiv-compare]: Equiv#comparewith
[equiv-value]: Equiv#valueof

[pair]: Pair
[pair-ap]: Pair#ap
[pair-bimap]: Pair#bimap
[pair-chain]: Pair#chain
[pair-concat]: Pair#concat
[pair-equals]: Pair#equals
[pair-extend]: Pair#extend
[pair-fst]: Pair#fst
[pair-map]: Pair#map
[pair-merge]: Pair#merge
[pair-sequence]: Pair#sequence
[pair-snd]: Pair#snd
[pair-swap]: Pair#swap
[pair-traverse]: Pair#traverse
[pair-toarray]: Pair#toarray

[pred]: Pred
[pred-empty]: Pred#empty
[pred-concat]: Pred#concat
[pred-contra]: Pred#contramap
[pred-run]: Pred#runwith
[pred-value]: Pred#valueof

[maybe]: Maybe
[maybe-nothing]: Maybe#nothing
[maybe-just]: Maybe#just
[maybe-of]: Maybe#of
[maybe-zero]: Maybe#zero
[maybe-alt]: Maybe#alt
[maybe-ap]: Maybe#ap
[maybe-bichain]: Maybe#bichain
[maybe-chain]: Maybe#chain
[maybe-coalesce]: Maybe#coalesce
[maybe-concat]: Maybe#concat
[maybe-equals]: Maybe#equals
[maybe-either]: Maybe#either
[maybe-map]: Maybe#map
[maybe-option]: Maybe#option
[maybe-sequence]: Maybe#sequence
[maybe-traverse]: Maybe#traverse
[maybe-zero]: Maybe#zero

[reader]: Reader
[reader-ask]: Reader#ask
[reader-of]: Reader#of
[reader-ap]: Reader#ap
[reader-chain]: Reader#chain
[reader-map]: Reader#map
[reader-run]: Reader#runwith

[readert]: ReaderT
[readert-ask]: ReaderT#ask
[readert-lift]: ReaderT#lift
[readert-liftfn]: ReaderT#liftfn
[readert-of]: ReaderT#of
[readert-ap]: ReaderT#ap
[readert-chain]: ReaderT#chain
[readert-map]: ReaderT#map
[readert-run]: ReaderT#runwith

[result]: Result
[result-err]: Result#err
[result-ok]: Result#ok
[result-of]: Result#of
[result-alt]: Result#alt
[result-ap]: Result#ap
[result-bichain]: Result#bichain
[result-bimap]: Result#bimap
[result-chain]: Result#chain
[result-coalesce]: Result#coalesce
[result-concat]: Result#concat
[result-either]: Result#either
[result-equals]: Result#equals
[result-map]: Result#map
[result-sequence]: Result#sequence
[result-swap]: Result#swap
[result-traverse]: Result#traverse

[state]: State
[state-get]: State#get
[state-modify]: State#modify
[state-put]: State#put
[state-of]: State#of
[state-ap]: State#ap
[state-chain]: State#chain
[state-map]: State#map
[state-run]: State#runwith
[state-eval]: State#evalwith
[state-exec]: State#execwith

[tuple]: Tuple
[tuple-concat]: Tuple#concat
[tuple-equals]: Tuple#equals
[tuple-map]: Tuple#map
[tuple-mapall]: Tuple#mapall
[tuple-merge]: Tuple#merge
[tuple-project]: Tuple#project
[tuple-toarray]: Tuple#toarray
