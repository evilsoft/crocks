---
title: "Monoids"
description: "Monoids API"
layout: "notopic"
icon: "code-file"
weight: 3
---

Each `Monoid` provides a means to represent a binary operation and is usually
locked down to a specific type. These are great when you need to combine a list
of values down to one value. In this library, any ADT that provides both an
`empty` and a `concat` function can be used as a `Monoid`. There are a few of
the [crocks][crocks] that are also monoidial, so be on the look out for those
as well.

All `Monoids` work with the following helper functions
[mconcat][mconcat], [mreduce][mreduce], [mconcatMap][mconcatmap] and [mreduceMap][mreducemap].

All `Monoids` provide `empty` and `type` functions on their Constructors as well
as the following Instance Functions: `inspect`, `type`, `valueOf`, `empty` and
`concat`.

| Monoid | Type | Operation | Empty (Identity) |
|---|---|---|---|
| [`All`][All] | Boolean | Logical AND | `true` |
| [`Any`][Any] | Boolean | Logical OR | `false` |
| [`Assign`][Assign] | Object | `Object.assign` | `{lb}{rb}` |
| [`Endo`][Endo] | Function | `compose` | `identity` |
| `First` | Maybe | First `Just` | `Nothing` |
| `Last` | Maybe | Last `Just` | `Nothing` |
| `Max` | Number | `Math.max` | `-Infinity` |
| `Min` | Number | `Math.min` | `Infinity` |
| [`Prod`][Prod] | Number | Multiplication | `1` |
| [`Sum`][Sum] | Number | Addition | `0` |

[crocks]: ../crocks/index.html
[mconcat]: ../functions/helpers.html#mconcat
[mreduce]: ../functions/helpers.html#mreduce
[mconcatMap]: ../functions/helpers.html#mconcatmap
[mreduceMap]: ../functions/helpers.html#mreducemap

[All]: All.html
[Any]: Any.html
[Assign]: Assign.html
[Endo]: Endo.html
[Prod]: Prod.html
[Sum]: Sum.html
