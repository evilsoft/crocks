---
title: "Transformation Functions"
description: "Transformation Functions API"
layout: "notopic"
functions: ["arraytolist", "asyncToPromise", "eithertoasync", "eithertofirst", "eithertolast", "eithertomaybe", "eithertoresult", "firsttoasync", "firsttoeither", "firsttolast", "firsttomaybe", "firsttoresult", "lasttoasync", "lasttoeither", "lasttofirst", "lasttomaybe", "lasttoresult", "listtoarray", "maybetoasync", "maybetoeither", "maybetofirst","maybetolast", "maybetoresult", "resulttoasync", "resulttoeither", "resulttofirst", "resulttolast", "resulttomaybe", "tupletoarray", "writertopair"]
weight: 60
---

Transformation functions are mostly used to reduce unwanted nesting of similar
types. Take for example the following structure:

```js runkit
import Either from 'crocks/Either'
import Maybe from 'crocks/Maybe'

import identity from 'crocks/combinators/identity'
import map from 'crocks/pointfree/map'
import option from 'crocks/pointfree/option'

const data =
  Either.of(Maybe.of(3))
//=> Right Just 3

// mapping on the inner Maybe is tedious at best
data
  .map(map(x => x + 1))   //=> Right Just 4
  .map(map(x => x * 10))  //=> Right Just 40

// and extraction...super gross
data
  .either(identity, identity)  //=> Just 3
  .option(0)                   //=> 3

// or
data
  .either(option(0), option(0))  // 3
```

The transformation functions, that ship with `crocks`, provide a means for
dealing with this. Using them effectively, can turn the above code into
something more like this:

```js runkit
import Either from 'crocks/Either'
import Maybe from 'crocks/Maybe'

import identity from 'crocks/combinators/identity'
import map from 'crocks/pointfree/map'
import maybeToEither from 'crocks/Either/maybeToEither'

const data =
  Either.of(Maybe.of(3))      //=> Right Just 3
    .chain(maybeToEither(0))  //=> Right 3

// mapping on a single Either, much better
data
  .map(x => x + 1)  //=> Right 4
  .map(x => x * 10) //=> Right 40

// no need to default the Left case anymore
data
  .either(identity, identity)
//=> 3

// effects of the inner type are applied immediately
const nested =
  Either.of(Maybe.Nothing)
//=> Right Nothing

const unnested =
  nested
    .chain(maybeToEither(0))
//=> Left 0

// Always maps, although the inner Maybe skips
nested
  .map(map(x => x + 1))        //=> Right Nothing (runs mapping)
  .map(map(x => x * 10))       //=> Right Nothing (runs mapping)
  .either(identity, identity)  //=> Nothing
  .option(0)                   //=> 0

// Never maps on a Left, just skips it
unnested
  .map(x => x + 1)             //=> Left 0 (skips mapping)
  .map(x => x * 10)            //=> Left 0 (skips mapping)
  .either(identity, identity)  //=> 0
```

Not all types can be transformed to and from each other. Some of them are lazy
and/or asynchronous, or are just too far removed. Also, some transformations
will result in a loss of information. Moving from an [`Either`][either] to
a [`Maybe`][maybe], for instance, would lose the [`Left`][left] value
of [`Either`][either] as a [`Maybe`][maybe]'s first parameter
([`Nothing`][nothing]) is fixed at `Unit`. Conversely, if you move the other way
around, from a [`Maybe`][maybe] to an [`Either`][either] you must provide a
default [`Left`][left] value. Which means, if the inner [`Maybe`][maybe] results
in a [`Nothing`][nothing], it will map to [`Left`][left] of your provided value.
As such, not all of these functions are guaranteed isomorphic. With some types
you just cannot go back and forth and expect to retain information.

Each function provides two signatures, one for if a Function is used for the
second argument and another if the source ADT is passed instead. Although it may
seem strange, this provides some flexibility on how to apply the transformation.
The ADT version is great for squishing an already nested type or to perform the
transformation in a composition. While the Function version can be used to
extend an existing function without having to explicitly compose it. Both
versions can be seen here:

```js runkit
import Either from 'crocks/Either'
import Maybe from 'crocks/Maybe'
import Async from 'crocks/Async'

import safeLift from 'crocks/Maybe/safeLift'
import maybeToAsync from 'crocks/Either/maybeToAsync'
import eitherToMaybe from 'crocks/Maybe/eitherToMaybe'
import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'

// Avoid nesting
// inc :: a -> Maybe Number
const inc =
  safeLift(isNumber, x => x + 1)

// using Function signature
// asyncInc :: a -> Async Number Number
const asyncInc =
  maybeToAsync(0, inc)

// using ADT signature to compose (extending functions)
// asyncInc :: a -> Async Number Number
const anotherInc =
  compose(maybeToAsync(0), inc)

// resolveValue :: a -> Async _ a
const resolveValue =
  Async.Resolved

resolveValue(3)                          // Resolved 3
  .chain(asyncInc)                       // Resolved 4
  .chain(anotherInc)                     // Resolved 5
  .chain(compose(maybeToAsync(20), inc)) // Resolved 6

resolveValue('oops')                     // Resolved 'oops'
  .chain(asyncInc)                       // Rejected 0
  .chain(anotherInc)                     // Rejected 0
  .chain(compose(maybeToAsync(20), inc)) // Rejected 0

// Squash existing nesting
// Just Right 'nice'
const good =
  Maybe.of(Either.Right('nice'))

// Just Left 'not so nice'
const bad =
  Maybe.of(Either.Left('not so nice'))

good
  .chain(eitherToMaybe) // Just 'nice'

bad
  .chain(eitherToMaybe) // Nothing
```

### Transformation Signatures
| Transform | ADT signature | Function Signature | Location |
|---|:---|:---|:---|
| `arrayToList` | `[ a ] -> List a` | `(a -> [ b ]) -> a -> List b` | `crocks/List` |
| [`asyncToPromise`][async-promise] | `Async e a -> Promise a e` | `(a -> Async e b) -> a -> Promise b e`  | `crocks/Async` |
| [`eitherToAsync`][either-async] | `Either e a -> Async e a` | `(a -> Either e b) -> a -> Async e b` | `crocks/Async` |
| [`eitherToFirst`][either-first] | `Either b a -> First a` | `(a -> Either c b) -> a -> First b` | `crocks/First` |
| [`eitherToLast`][either-last] | `Either b a -> Last a` | `(a -> Either c b) -> a -> Last b` | `crocks/Last` |
| [`eitherToMaybe`][either-maybe] | `Either b a -> Maybe a` | `(a -> Either c b) -> a -> Maybe b` | `crocks/Maybe` |
| [`eitherToResult`][either-result] | `Either e a -> Result e a` | `(a -> Either e b) -> a -> Result e b` | `crocks/Result` |
| [`firstToAsync`][first-async] | `e -> First a -> Async e a` | `e -> (a -> First b) -> a -> Async e b` | `crocks/Async` |
| [`firstToEither`][first-either] | `c -> First a -> Either c a` | `c -> (a -> First b) -> a -> Either c b` | `crocks/Either` |
| [`firstToLast`][first-last] | `First a -> Last a` | `(a -> First b) -> a -> Last b` | `crocks/Last` |
| [`firstToMaybe`][first-maybe] | `First a -> Maybe a` | `(a -> First b) -> a -> Maybe b` | `crocks/Maybe` |
| [`firstToResult`][first-result] | `c -> First a -> Result c a` | `c -> (a -> First b) -> a -> Result c b` | `crocks/Result` |
| [`lastToAsync`][last-async] | `e -> Last a -> Async e a` | `e -> (a -> Last b) -> a -> Async e b` | `crocks/Async` |
| [`lastToEither`][last-either] | `c -> Last a -> Either c a` | `c -> (a -> Last b) -> a -> Either c b` | `crocks/Either` |
| [`lastToFirst`][last-first] | `Last a -> First a` | `(a -> Last b) -> a -> First b` | `crocks/First` |
| [`lastToMaybe`][last-maybe] | `Last a -> Maybe a` | `(a -> Last b) -> a -> Maybe b` | `crocks/Maybe` |
| [`lastToResult`][last-result] | `c -> Last a -> Result c a` | `c -> (a -> Last b) -> a -> Result c b` | `crocks/Result` |
| `listToArray` | `List a -> [ a ]` | `(a -> List b) -> a -> [ b ]` | `crocks/List` |
| [`maybeToArray`][maybe-array] | `Maybe a -> [ a ]` | `(a -> Maybe b) -> a -> [ b ]` | `crocks/Maybe` |
| [`maybeToAsync`][maybe-async] | `e -> Maybe a -> Async e a` | `e -> (a -> Maybe b) -> a -> Async e b` | `crocks/Async` |
| [`maybeToEither`][maybe-either] | `c -> Maybe a -> Either c a` | `c -> (a -> Maybe b) -> a -> Either c b` | `crocks/Either` |
| [`maybeToFirst`][maybe-first] | `Maybe a -> First a` | `(a -> Maybe b) -> a -> First b` | `crocks/First` |
| [`maybeToLast`][maybe-last] | `Maybe a -> Last a` | `(a -> Maybe b) -> a -> Last b` | `crocks/Last` |
| `maybeToList` | `Maybe a -> List a` | `(a -> Maybe b) -> a -> List b` | `crocks/List` |
| [`maybeToResult`][maybe-result] | `c -> Maybe a -> Result c a` | `c -> (a -> Maybe b) -> a -> Result c b` | `crocks/Result` |
| [`resultToAsync`][result-async] | `Result e a -> Async e a` | `(a -> Result e b) -> a -> Async e b` | `crocks/Async` |
| [`resultToEither`][result-either] | `Result e a -> Either e a` | `(a -> Result e b) -> a -> Either e b` | `crocks/Either` |
| [`resultToFirst`][result-first] | `Result e a -> First a` | `(a -> Result e b) -> a -> First b` | `crocks/First` |
| [`resultToLast`][result-last] | `Result e a -> Last a` | `(a -> Result e b) -> a -> Last b` | `crocks/Last` |
| [`resultToMaybe`][result-maybe] | `Result e a -> Maybe a` | `(a -> Result e b) -> a -> Maybe b` | `crocks/Maybe` |
| [`tupleToArray`][tuple-array] | `Tuple a -> [ a ]` | `(a -> Tuple b) -> a -> [ b ]` | `crocks/Tuple` |
| `writerToPair` | `Writer m a -> Pair m a` | `(a -> Writer m b) -> a -> Pair m b` | `crocks/Pair` |

[async-promise]: ../crocks/Async#asynctopromise

[either-async]: ../crocks/Async#eithertoasync
[first-async]: ../crocks/Async#firsttoasync
[last-async]: ../crocks/Async#lasttoasync
[maybe-async]: ../crocks/Async#maybetoasync
[result-async]: ../crocks/Async#resulttoasync

[first-either]: ../crocks/Either#firsttoeither
[last-either]: ../crocks/Either#lasttoeither
[maybe-either]: ../crocks/Either#maybetoeither
[result-either]: ../crocks/Either#resulttoeither

[either-maybe]: ../crocks/Maybe#eithertomaybe
[first-maybe]: ../crocks/Maybe#firsttomaybe
[last-maybe]: ../crocks/Maybe#lasttomaybe
[maybe-array]: ../crocks/Maybe#maybetoarray
[result-maybe]: ../crocks/Maybe#resulttomaybe

[either-first]: ../monoids/First#eithertofirst
[last-first]: ../monoids/First#lasttofirst
[maybe-first]: ../monoids/First#maybetofirst
[result-first]: ../monoids/First#resulttofirst

[either-last]: ../monoids/Last#eithertolast
[first-last]: ../monoids/Last#firsttolast
[maybe-last]: ../monoids/Last#maybetolast
[result-last]: ../monoids/Last#resulttolast

[either-result]: ../crocks/Result#eithertoresult
[first-result]: ../crocks/Result#firsttoresult
[last-result]: ../crocks/Result#lasttoresult
[maybe-result]: ../crocks/Result#maybetoresult

[tuple-array]: ../crocks/Tuple#tupletoarray

[maybe]: ../crocks/Maybe
[nothing]: ../crocks/Maybe#nothing
[either]: ../crocks/Either
[left]: ../crocks/Either#left
