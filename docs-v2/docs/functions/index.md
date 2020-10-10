---
title: "Functions"
description: "functions"
layout: "notopic"
icon: "code-file"
weight: 40
slug: /functions/
---

There are (6) function classifications included in this library:

* [Combinators](#combinators): A collection of functions that are used for
working with other functions. These do things like compose (2) functions
together, or flip arguments on a function. They typically either take a
function, return a function or a bit a both. These are considered the glue that
holds the mighty house of `crocks` together and a valuable aid in writing
reusable code.

* [Helper Functions](#helpers): All other support functions that are
either convenient versions of combinators or not even combinators at all cover
this group.

* [Logic Functions](#logic): A helpful collection of Logic based
combinators. All of these functions work with predicate functions and let you
combine them in some very interesting ways.

* [Predicate Functions](predicate-functions): A helpful collection of predicate
functions to get you started.

* [Point-free Functions](pointfree-functions): Wanna use these ADTs in a
way that you never have to reference the actual data being worked on? Well here
is where you will find all of these functions to do that. For every algebra
available on both the [Crocks][crocks] and [Monoids][monoids] there is a
function here.

* [Transformation Functions](transformation-functions): All the functions found
here are used to transform from one type to another, naturally. These come are
handy in situations where you have functions that return one type (like
an `Either`), but are working in a context of another (say `Maybe`). You would
like to compose these, but in doing so will result in a nesting that you will
need to account for for the rest of your flow.

## Combinators

| Function | Signature | Location |
|:---|:---|:---|
| [`applyTo`][applyto] | `a -> (a -> b) -> b` | `crocks/combinators/applyTo` |
| [`composeB`][composeb] | `(b -> c) -> (a -> b) -> a -> c` | `crocks/combinators/composeB` |
| [`constant`][constant] | `a -> () -> a` | `crocks/combinators/constant` |
| [`converge`][converge] | `(b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d` | `crocks/combinators/converge` |
| [`flip`][flip] | `(a -> b -> c) -> b -> a -> c` | `crocks/combinators/flip` |
| [`identity`][identity] | `a -> a` | `crocks/combinators/identity` |
| [`psi`][psi] | `(b -> b -> c) -> (a -> b) -> a -> a -> c` | `crocks/combinators/psi` |
| [`substitution`][substitution] | `(a -> b -> c) -> (a -> b) -> a -> c` | `crocks/combinators/substitution` |

## Helpers

| Function | Signature | Location |
|:---|:---|:---|
| [`assign`][assign] | `Object -> Object -> Object` | `crocks/helpers/assign` |
| [`assoc`][setprop]<br /><i>(deprecated)</i> | <code>(String &#124; Integer) -> a -> (Object &#124; Array) -> (Object &#124; Array)</code> | `crocks/helpers/assoc` |
| [`binary`][binary] | `((*) -> c) -> a -> b -> c` | `crocks/helpers/binary` |
| [`branch`][branch] | `a -> Pair a a` | `crocks/Pair/branch` |
| [`compose`][compose] | `((y -> z), ..., (a -> b)) -> a -> z` | `crocks/helpers/compose` |
| [`composeK`][composek] | `Chain m => ((y -> m z), ..., (a -> m b)) -> a -> m z` | `crocks/helpers/composeK` |
| [`composeP`][composep] | `Promise p => ((y -> p z c), ..., (a -> p b c)) -> a -> p z c` | `crocks/helpers/composeP` |
| [`composeS`][composes] | `Semigroupoid s => (s y z, ..., s a b) -> s a z` | `crocks/helpers/composeS` |
| [`curry`][curry] | `((a, b, ...) -> z) -> a -> b -> ... -> z` | `crocks/helpers/curry` |
| [`defaultProps`][defaultprops] | `Object -> Object -> Object` | `crocks/helpers/defaultProps` |
| [`defaultTo`][defaultto] | `a -> b -> a` | `crocks/helpers/defaultTo` |
| [`dissoc`][unsetprop]<br /><i>(deprecated)</i> | <code>(String &#124; Integer) -> a -> a</code> | `crocks/helpers/dissoc` |
| [`fanout`][fanout] | `(a -> b) -> (a -> c) -> (a -> Pair b c)` | `crocks/Pair/fanout` |
| [`find`][find] | <code>Foldable f => ((a -> Boolean) &#124; Pred) -> f a -> Maybe a</code> | `crocks/Maybe/find` |
| [`fromPairs`][frompairs] | `Foldable f => f (Pair String a) -> Object` | `crocks/helpers/fromPairs` |
| [`getPath`][getpath] | <code>[ (String &#124; Integer) ] -> a -> Maybe b</code> | `crocks/Maybe/getPath` |
| [`getPathOr`][getpathor] | <code>a -> f [ (String &#124; Integer) ] -> b -> a</code> | `crocks/helpers/getPathOr` |
| [`getProp`][getprop] | <code>(String &#124; Integer) -> a -> Maybe b</code> | `crocks/Maybe/getProp` |
| [`getPropOr`][getpropor] | <code>a -> (String &#124; Integer) -> b -> c</code> | `crocks/helpers/getPropOr` |
| [`liftA2`][lifta2] | `Applicative m => (a -> b -> c) -> m a -> m b -> m c` | `crocks/helpers/liftA2` |
| [`liftA3`][lifta3] | `Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d` | `crocks/helpers/liftA3` |
| [`liftN`][liftn] | `Applicative m => Number -> ((*) -> a) -> (*m) -> m a` | `crocks/helpers/liftN` |
| [`mapProps`][mapprops] | `Object -> Object -> Object` | `crocks/helpers/mapProps` |
| [`mapReduce`][mapreduce] | `Foldable f => (a -> b) -> (c -> b -> c) -> c -> f a -> c` | `crocks/helpers/mapReduce` |
| [`mconcat`][mconcat] | `Monoid m, Foldable f => m -> f a -> m a` | `crocks/helpers/mconcat` |
| [`mconcatMap`][mconcatmap] | `Monoid m, Foldable f => m -> (b -> a) -> f b -> m a` | `crocks/helpers/mconcatMap` |
| [`mreduce`][mreduce] | `Monoid m, Foldable f => m -> f a -> a` | `crocks/helpers/mreduce` |
| [`mreduceMap`][mreducemap] | `Monoid m, Foldable f => m -> (b -> a) -> f b -> a` | `crocks/helpers/mreduceMap` |
| [`nAry`][nary] | `Number -> ((*) -> a) -> (*) -> a` | `crocks/helpers/nAry` |
| [`objOf`][objof] | `String -> a -> Object` | `crocks/helpers/objOf` |
| [`omit`][omit] | `[ String ] -> Object -> Object` | `crocks/helpers/omit` |
| [`once`][once] | `((*) -> a) -> ((*) -> a)` | `crocks/helpers/once` |
| [`partial`][partial] | `(((*) -> c), *) -> (*) -> c` | `crocks/helpers/partial` |
| [`pick`][pick] | `Foldable f => f String -> Object -> Object` | `crocks/helpers/pick` |
| [`pipe`][pipe] | `((a -> b), ..., (y -> z)) -> a -> z` | `crocks/helpers/pipe` |
| [`pipeK`][pipek] | `Chain m => ((a -> m b), ..., (y -> m z)) -> a -> m z` | `crocks/helpers/pipeK` |
| [`pipeP`][pipep] | `Promise p => ((a -> p b d), ..., (y -> p z d)) -> a -> p z d` | `crocks/helpers/pipeP` |
| [`pipeS`][pipes] | `Semigroupoid s => (s a b, ..., s y z) -> s a z` | `crocks/helpers/pipeS` |
| [`prop`][getprop]<br /><i>(deprecated)</i> | <code>(String &#124; Integer) -> a -> Maybe b</code> | `crocks/Maybe/prop` |
| [`propOr`][getpropor]<br /><i>(deprecated)</i> | <code>a -> (String &#124; Integer) -> b -> c</code> | `crocks/helpers/propOr` |
| [`propPath`][getpath]<br /><i>(deprecated)</i> | <code>[ (String &#124; Integer) ] -> a -> Maybe b</code> | `crocks/Maybe/propPath` |
| [`propPathOr`][getpathor]<br /><i>(deprecated)</i> | <code>a -> [ (String &#124; Integer) ] -> b -> a</code> | `crocks/helpers/propPathOr` |
| [`safe`][safe] | <code>((a -> Boolean) &#124; Pred) -> a -> Maybe a</code> | `crocks/Maybe/safe` |
| [`safeAfter`][safeafter] | <code>safeAfter :: ((b -> Boolean) &#124; Pred) -> (a -> b) -> a -> Maybe b</code> | `crocks/Maybe/safeAfter` |
| [`safeLift`][safelift] | <code>((a -> Boolean) &#124; Pred) -> (a -> b) -> a -> Maybe b</code> | `crocks/Maybe/safeLift` |
| [`setPath`][setpath] | <code>[ (String &#124; Integer) ] -> a -> (Object &#124; Array) -> (Object &#124; Array)</code> | `crocks/helpers/setPath` |
| [`setProp`][setprop] | <code>(String &#124; Integer) -> a -> (Object &#124; Array) -> (Object &#124; Array)</code> | `crocks/helpers/setProp` |
| [`tap`][tap] | `(a -> b) -> a -> a` | `crocks/helpers/tap` |
| [`toPairs`][topairs] | `Object -> List (Pair String a)` | `crocks/Pair/toPairs` |
| [`tryCatch`][trycatch] | `((*) -> b) -> (*) -> Result e b` | `crocks/Result/tryCatch` |
| [`unary`][unary] | `((*) -> b) -> a -> b` | `crocks/helpers/unary` |
| [`unit`][unit] | `() -> undefined` | `crocks/helpers/unit` |
| [`unsetPath`][unsetpath] | <code>[ (String &#124; Integer) ] -> a -> a</code>  | `crocks/helpers/unsetPath` |
| [`unsetProp`][unsetprop] | <code>(String &#124; Integer) -> a -> a</code> | `crocks/helpers/unsetProp` |

## Logic

Every function in `crocks`, that takes a predicate function of the
form `a -> Boolean`, can be replaced with a [Pred][pred] instance of the
type: `Pred a` and vice-versa

| Function | Signature | Location |
|:---|:---|:---|
| [`and`][and] | `(a -> Boolean) -> (a -> Boolean) -> a -> Boolean` | `crocks/logic/and` |
| [`ifElse`][ifelse] | `(a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b` | `crocks/logic/ifElse` |
| [`implies`][implies] | `(a -> Boolean) -> (a -> Boolean) -> a -> Boolean` | `crocks/logic/implies` |
| [`not`][not] | `(a -> Boolean) -> a -> Boolean` | `crocks/logic/not` |
| [`or`][or] | `(a -> Boolean) -> (a -> Boolean) -> a -> Boolean` | `crocks/logic/or` |
| [`unless`][unless] | `(a -> Boolean) -> (a -> a) -> a -> a` | `crocks/logic/unless` |
| [`when`][when] | `(a -> Boolean) -> (a -> a) -> a -> a` | `crocks/logic/when` |

[monoids]: ../monoids/
[crocks]: ../crocks/
[pred]: ../crocks/Pred

[applyto]: combinators#applyto
[composeb]: combinators#composeb
[constant]: combinators#constant
[converge]: combinators#converge
[flip]: combinators#flip
[identity]: combinators#identity
[psi]: combinators#psi
[substitution]: combinators#substitution

[assign]: helpers#assign
[binary]: helpers#binary
[branch]: ../crocks/Pair#branch
[compose]: helpers#compose
[composek]: helpers#composek
[composep]: helpers#composep
[composes]: helpers#composes
[curry]: helpers#curry
[defaultprops]: helpers#defaultprops
[defaultto]: helpers#defaultto
[dissoc]: helpers#dissoc
[fanout]: helpers#fanout
[find]: ../crocks/Maybe#find
[frompairs]: helpers#frompairs
[getpath]: ../crocks/Maybe#getpath
[getpathor]: helpers#getpathor
[getprop]: ../crocks/Maybe#getprop
[getpropor]: helpers#getpropor
[lifta2]: helpers#lifta2
[lifta3]: helpers#lifta3
[liftn]: helpers#liftn
[mapprops]: helpers#mapprops
[mapreduce]: helpers#mapreduce
[mconcat]: helpers#mconcat
[mconcatmap]: helpers#mconcatmap
[mreduce]: helpers#mreduce
[mreducemap]: helpers#mreducemap
[nary]: helpers#nary
[objof]: helpers#objof
[omit]: helpers#omit
[once]: helpers#once
[partial]: helpers#partial
[pick]: helpers#pick
[pipe]: helpers#pipe
[pipek]: helpers#pipek
[pipep]: helpers#pipep
[pipes]: helpers#pipes
[proppath]: ../crocks/Maybe#proppath
[safe]: ../crocks/Maybe#safe
[safeafter]: ../crocks/Maybe#safeafter
[safelift]: ../crocks/Maybe#safelift
[setpath]: helpers#setpath
[setprop]: helpers#setprop
[tap]: helpers#tap
[topairs]: ../crocks/Pair#topairs
[trycatch]: helpers#trycatch
[unary]: helpers#unary
[unit]: helpers#unit
[unsetpath]: helpers#unsetpath
[unsetprop]: helpers#unsetprop

[and]: logic-functions#and
[ifelse]: logic-functions#ifelse
[implies]: logic-functions#implies
[not]: logic-functions#not
[or]: logic-functions#or
[unless]: logic-functions#unless
[when]: logic-functions#when
