<header>

# Crocks

</header>

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
| [`Const`][const] | [`empty`][const-empty], [`of`][const-of] | [`ap`][const-ap], [`concat`][const-concat], [`empty`][const-empty], [`equals`][const-equals], [`map`][const-map], [`of`][const-of], [`valueOf`][const-valueof] |
| [`Either`][either] | [`Left`][either-left], [`Right`][either-right], [`of`][either-of]| [`alt`][either-alt], [`ap`][either-ap], [`bimap`][either-bimap], [`chain`][either-chain], [`coalesce`][either-coalesce], [`concat`][either-concat], [`either`][either-either], [`equals`][either-equals], [`map`][either-map], [`of`][either-of], [`sequence`][either-sequence], [`swap`][either-swap], [`traverse`][either-traverse] |
| [`Equiv`][equiv] | [`empty`][equiv-empty] | [`concat`][equiv-concat], [`contramap`][equiv-contra], [`compareWith`][equiv-compare], [`valueOf`][equiv-value] |
| [`Identity`][identity] | [`of`][identity-of] | [`ap`][identity-ap], [`chain`][identity-chain], [`concat`][identity-concat], [`equals`][identity-equals], [`map`][identity-map], [`of`][identity-of], [`sequence`][identity-sequence], [`traverse`][identity-traverse], [`valueOf`][identity-valueof] |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `fromArray`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `fold`, `foldMap`, `head`, `init`, `last`, `map`, `of`, `reduce`, `reduceRight`, `reject`, `sequence`, `tail`, `toArray`, `traverse`, `valueOf` |
| [`Maybe`][maybe] | [`Nothing`][maybe-nothing], [`Just`][maybe-just], [`of`][maybe-of], [`zero`][maybe-zero] | [`alt`][maybe-alt], [`ap`][maybe-ap], [`chain`][maybe-chain], [`coalesce`][maybe-coalesce], [`concat`][maybe-concat], [`equals`][maybe-equals], [`either`][maybe-either], [`map`][maybe-map], [`of`][maybe-of], [`option`][maybe-option], [`sequence`][maybe-sequence], [`traverse`][maybe-traverse], [`zero`][maybe-zero] |
| [`Pair`][pair] | --- | [`ap`][pair-ap], [`bimap`][pair-bimap], [`chain`][pair-chain], [`concat`][pair-concat], [`equals`][pair-equals], [`extend`][pair-extend], [`fst`][pair-fst], [`map`][pair-map], [`merge`][pair-merge], [`sequence`][pair-sequence], [`snd`][pair-snd], [`swap`][pair-swap], [`traverse`][pair-traverse], [`toArray`][pair-toarray] |
| [`Pred`][pred] * | [`empty`][pred-empty] | [`concat`][pred-concat], [`contramap`][pred-contra], [`runWith`][pred-run], [`valueOf`][pred-value] |
| [`Reader`][reader] | [`ask`][reader-ask], [`of`][reader-of] | [`ap`][reader-ap], [`chain`][reader-chain], [`map`][reader-map], [`runWith`][reader-run] |
| [`ReaderT`][readert] | [`ask`][readert-ask], [`lift`][readert-lift], [`liftFn`][readert-liftfn], [`of`][readert-of] | [`ap`][readert-ap], [`chain`][readert-chain], [`map`][readert-map], [`runWith`][readert-run] |
| [`Result`][result] | [`Err`][result-err], [`Ok`][result-ok], [`of`][result-of]| [`alt`][result-alt], [`ap`][result-ap], [`bimap`][result-bimap], [`chain`][result-chain], [`coalesce`][result-coalesce], [`concat`][result-concat], [`either`][result-either], [`equals`][result-equals], [`map`][result-map], [`of`][result-of], [`sequence`][result-sequence], [`swap`][result-swap], [`traverse`][result-traverse] |
| `Star` | `id` | `both`, `compose`, `contramap`, `map`, `promap`, `runWith` |
| [`State`][state] | [`get`][state-get], [`modify`][state-modify], [`of`][state-of], [`put`][state-put] | [`ap`][state-ap], [`chain`][state-chain], [`evalWith`][state-eval], [`execWith`][state-exec], [`map`][state-map], [`runWith`][state-run] |
| [`Tuple`][tuple] | --- | [`concat`][tuple-concat], [`equals`][tuple-equals], [`map`][tuple-map], [`mapAll`][tuple-mapall], [`merge`][tuple-merge], [`project`][tuple-project], [`toArray`][tuple-toarray] |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `valueOf` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `valueOf` |

\* based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)

[arrow]: crocks/Arrow
[arrow-id]: crocks/Arrow#id
[arrow-both]: crocks/Arrow#both
[arrow-compose]: crocks/Arrow#compose
[arrow-contra]: crocks/Arrow#contramap
[arrow-first]: crocks/Arrow#first
[arrow-map]: crocks/Arrow#map
[arrow-promap]: crocks/Arrow#promap
[arrow-runwith]: crocks/Arrow#runwith
[arrow-second]: crocks/Arrow#second

[async]: crocks/Async
[async-rejected]: crocks/Async#rejected
[async-resolved]: crocks/Async#resolved
[async-all]: crocks/Async#all
[async-resolveafter]: crocks/Async#resolveafter
[async-rejectafter]: crocks/Async#rejectafter
[async-fromnode]: crocks/Async#fromnode
[async-frompromise]: crocks/Async#frompromise
[async-of]: crocks/Async#of
[async-alt]: crocks/Async#alt
[async-ap]: crocks/Async#ap
[async-bimap]: crocks/Async#bimap
[async-chain]: crocks/Async#chain
[async-coalesce]: crocks/Async#coalesce
[async-race]: crocks/Async#race
[async-fork]: crocks/Async#fork
[async-map]: crocks/Async#map
[async-swap]: crocks/Async#swap
[async-topromise]: crocks/Async#topromise

[const]: crocks/Const
[const-equals]: crocks/Const#equals
[const-concat]: crocks/Const#concat
[const-empty]: crocks/Const#empty
[const-map]: crocks/Const#map
[const-ap]: crocks/Const#ap
[const-of]: crocks/Const#of
[const-valueof]: crocks/Const#valueof

[either]: crocks/Either
[either-left]: crocks/Either#left
[either-right]: crocks/Either#right
[either-of]: crocks/Either#of
[either-alt]: crocks/Either#alt
[either-ap]: crocks/Either#ap
[either-bimap]: crocks/Either#bimap
[either-chain]: crocks/Either#chain
[either-coalesce]: crocks/Either#coalesce
[either-concat]: crocks/Either#concat
[either-either]: crocks/Either#either
[either-equals]: crocks/Either#equals
[either-map]: crocks/Either#map
[either-sequence]: crocks/Either#sequence
[either-swap]: crocks/Either#swap
[either-traverse]: crocks/Either#traverse

[identity]: crocks/Identity
[identity-of]: crocks/Identity#of
[identity-alt]: crocks/Identity#alt
[identity-ap]: crocks/Identity#ap
[identity-chain]: crocks/Identity#chain
[identity-concat]: crocks/Identity#concat
[identity-equals]: crocks/Identity#equals
[identity-map]: crocks/Identity#map
[identity-sequence]: crocks/Identity#sequence
[identity-traverse]: crocks/Identity#traverse
[identity-valueof]: crocks/Identity#valueof

[equiv]: crocks/Equiv
[equiv-empty]: crocks/Equiv#empty
[equiv-concat]: crocks/Equiv#concat
[equiv-contra]: crocks/Equiv#contramap
[equiv-compare]: crocks/Equiv#comparewith
[equiv-value]: crocks/Equiv#valueof

[pair]: crocks/Pair
[pair-ap]: crocks/Pair#ap
[pair-bimap]: crocks/Pair#bimap
[pair-chain]: crocks/Pair#chain
[pair-concat]: crocks/Pair#concat
[pair-equals]: crocks/Pair#equals
[pair-extend]: crocks/Pair#extend
[pair-fst]: crocks/Pair#fst
[pair-map]: crocks/Pair#map
[pair-merge]: crocks/Pair#merge
[pair-sequence]: crocks/Pair#sequence
[pair-snd]: crocks/Pair#snd
[pair-swap]: crocks/Pair#swap
[pair-traverse]: crocks/Pair#traverse
[pair-toarray]: crocks/Pair#toarray

[pred]: crocks/Pred
[pred-empty]: crocks/Pred#empty
[pred-concat]: crocks/Pred#concat
[pred-contra]: crocks/Pred#contramap
[pred-run]: crocks/Pred#runwith
[pred-value]: crocks/Pred#valueof

[maybe]: crocks/Maybe
[maybe-nothing]: crocks/Maybe#nothing
[maybe-just]: crocks/Maybe#just
[maybe-of]: crocks/Maybe#of
[maybe-zero]: crocks/Maybe#zero
[maybe-alt]: crocks/Maybe#alt
[maybe-ap]: crocks/Maybe#ap
[maybe-chain]: crocks/Maybe#chain
[maybe-coalesce]: crocks/Maybe#coalesce
[maybe-concat]: crocks/Maybe#concat
[maybe-equals]: crocks/Maybe#equals
[maybe-either]: crocks/Maybe#either
[maybe-map]: crocks/Maybe#map
[maybe-option]: crocks/Maybe#option
[maybe-sequence]: crocks/Maybe#sequence
[maybe-traverse]: crocks/Maybe#traverse
[maybe-zero]: crocks/Maybe#zero

[reader]: crocks/Reader
[reader-ask]: crocks/Reader#ask
[reader-of]: crocks/Reader#of
[reader-ap]: crocks/Reader#ap
[reader-chain]: crocks/Reader#chain
[reader-map]: crocks/Reader#map
[reader-run]: crocks/Reader#runwith

[readert]: crocks/ReaderT
[readert-ask]: crocks/ReaderT#ask
[readert-lift]: crocks/ReaderT#lift
[readert-liftfn]: crocks/ReaderT#liftfn
[readert-of]: crocks/ReaderT#of
[readert-ap]: crocks/ReaderT#ap
[readert-chain]: crocks/ReaderT#chain
[readert-map]: crocks/ReaderT#map
[readert-run]: crocks/ReaderT#runwith

[result]: crocks/Result
[result-err]: crocks/Result#err
[result-ok]: crocks/Result#ok
[result-of]: crocks/Result#of
[result-alt]: crocks/Result#alt
[result-ap]: crocks/Result#ap
[result-bimap]: crocks/Result#bimap
[result-chain]: crocks/Result#chain
[result-coalesce]: crocks/Result#coalesce
[result-concat]: crocks/Result#concat
[result-either]: crocks/Result#either
[result-equals]: crocks/Result#equals
[result-map]: crocks/Result#map
[result-sequence]: crocks/Result#sequence
[result-swap]: crocks/Result#swap
[result-traverse]: crocks/Result#traverse

[state]: crocks/State
[state-get]: crocks/State#get
[state-modify]: crocks/State#modify
[state-put]: crocks/State#put
[state-of]: crocks/State#of
[state-ap]: crocks/State#ap
[state-chain]: crocks/State#chain
[state-map]: crocks/State#map
[state-run]: crocks/State#runwith
[state-eval]: crocks/State#evalwith
[state-exec]: crocks/State#execwith

[tuple]: crocks/Tuple
[tuple-concat]: crocks/Tuple#concat
[tuple-equals]: crocks/Tuple#equals
[tuple-map]: crocks/Tuple#map
[tuple-mapall]: crocks/Tuple#mapall
[tuple-merge]: crocks/Tuple#merge
[tuple-project]: crocks/Tuple#project
[tuple-toarray]: crocks/Tuple#toarray
