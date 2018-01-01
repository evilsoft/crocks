---
title: "Crocks"
description: "Crocks API"
layout: "notopic"
icon: "code-file"
weight: 2
---

### Crocks
The `crocks` are the heart and soul of this library. This is where you will find
all your favorite ADT's you have grown to love. They include gems such as:
`Maybe`, `Either` and `IO`, to name a few. The are usually just a simple
constructor that takes either a function or value (depending on the type)
and will return you a "container" that wraps whatever you passed it. Each
container provides a variety of functions that act as the operations you can do
on the contained value. There are many types that share the same function names,
but what they do from type to type may vary.  Every Crock provides type function
on the Constructor and both inspect and type functions on their Instances.

All `Crocks` are Constructor functions of the given type, with `Writer` being an
exception. The `Writer` function takes a [`Monoid`](#monoids) that will
represent the `log`. Once you provide the [`Monoid`](#monoids), the function
will return the `Writer` Constructor for your `Writer` using that specific
[`Monoid`](#monoids).

| Crock | Constructor | Instance |
|---|:---|:---|
| `Arrow` | `id` | `both`, `compose`, `contramap`, `empty`, `first`, `map`, `promap`, `runWith`, `second` |
| `Async` | `Rejected`, `Resolved`, `all`, `fromNode`, `fromPromise`, `of` | `alt`, `ap`, `bimap`, `chain`, `coalesce`, `fork`, `map`, `of`, `swap`, `toPromise` |
| `Const` | -- | `ap`, `chain`, `concat`, `equals`, `map`, `valueOf` |
| `Either` | `Left`, `Right`, `of`| `alt`, `ap`, `bimap`, `chain`, `coalesce`, `concat`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse` |
| `Identity` | `of` | `ap`, `chain`, `concat`, `equals`, `map`, `of`, `sequence`, `traverse`, `valueOf` |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `fromArray`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `head`, `map`, `of`, `reduce`, `reject`, `sequence`, `tail`, `toArray`, `traverse`, `valueOf` |
| `Maybe` | `Nothing`, `Just`, `of`, `zero` | `alt`, `ap`, `chain`, `coalesce`, `concat`, `equals`, `either`, `map`, `of`, `option`, `sequence`, `traverse`, `zero` |
| `Pair` | --- | `ap`, `bimap`, `chain`, `concat`, `equals`, `extend`, `fst`, `map`, `merge`, `of`, `snd`, `swap`, `toArray` |
| `Pred` * | `empty` | `concat`, `contramap`, `empty`, `runWith`, `valueOf` |
| `Reader` | `ask`, `of`| `ap`, `chain`, `map`, `of`, `runWith` |
| `Result` | `Err`, `Ok`, `of`| `alt`, `ap`, `bimap`, `chain`, `coalesce`, `concat`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse` |
| `Star` | `id` | `both`, `compose`, `contramap`, `map`, `promap`, `runWith` |
| `State` | `get`, `modify` `of`, `put`| `ap`, `chain`, `evalWith`, `execWith`, `map`, `of`, `runWith` |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `valueOf` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `valueOf` |

\* based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)
