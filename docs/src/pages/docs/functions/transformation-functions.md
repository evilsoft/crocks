---
title: "Transformation Functions"
description: "Transformation Functions API"
layout: "notopic"
weight: 6
---

Transformation functions are mostly used to reduce unwanted nesting of similar
types. Take for example the following structure:

```javascript
const data =
  Either.of(Maybe.of(3))  // Right Just 3

// mapping on the inner Maybe is tedious at best
data
  .map(map(x => x + 1))   // Right Just 4
  .map(map(x => x * 10))  // Right Just 40

// and extraction...super gross
data
  .either(identity, identity)  // Just 3
  .option(0)                   // 3

// or
data
  .either(option(0), option(0))  // 3
```

The transformation functions, that ship with `crocks`, provide a means for
dealing with this. Using them effectively, can turn the above code into
something more like this:

```javascript
const data =
  Either.of(Maybe.of(3))      // Right Just 3
    .chain(maybeToEither(0))  // Right 3

// mapping on a single Either, much better
data
  .map(x => x + 1)  // Right 4
  .map(x => x * 10) // Right 40

// no need to default the Left case anymore
data
  .either(identity, identity) // 3

// effects of the inner type are applied immediately
const nested =
  Either.of(Maybe.Nothing) // Right Nothing

const unnested =
  nested
    .chain(maybeToEither(0))  // Left 0

// Always maps, although the inner Maybe skips
nested
  .map(map(x => x + 1))        // Right Nothing (runs mapping)
  .map(map(x => x * 10))       // Right Nothing (runs mapping)
  .either(identity, identity)  // Nothing
  .option(0)                   // 0

// Never maps on a Left, just skips it
unnested
  .map(x => x + 1)             // Left 0 (skips mapping)
  .map(x => x * 10)            // Left 0 (skips mapping)
  .either(identity, identity)  // 0
```

Not all types can be transformed to and from each other. Some of them are lazy
and/or asynchronous, or are just too far removed. Also, some transformations
will result in a loss of information. Moving from an `Either` to a `Maybe`, for
instance, would lose the `Left` value of `Either` as a `Maybe`'s first parameter
(`Nothing`) is fixed at `Unit`. Conversely, if you move the other way around,
from a `Maybe` to an `Either` you must provide a default `Left` value. Which
means, if the inner `Maybe` results in a `Nothing`, it will map to `Left` of
your provided value. As such, not all of these functions are guaranteed
isomorphic. With some types you just cannot go back and forth and expect to
retain information.

Each function provides two signatures, one for if a Function is used for the
second argument and another if the source ADT is passed instead. Although it may
seem strange, this provides some flexibility on how to apply the transformation.
The ADT version is great for squishing an already nested type or to perform the
transformation in a composition. While the Function version can be used to
extend an existing function without having to explicitly compose it. Both
versions can be seen here:

```javascript
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

#### Transformation Signatures
| Transform | ADT signature | Function Signature | Location |
|---|:---|:---|:---|
| `arrayToList` | `[ a ] -> List a` | `(a -> [ b ]) -> a -> List b` | `crocks/List` |
| `eitherToAsync` | `Either e a -> Async e a` | `(a -> Either e b) -> a -> Async e b` | `crocks/Async` |
| `eitherToFirst` | `Either b a -> First a` | `(a -> Either c b) -> a -> First b` | `crocks/First` |
| `eitherToLast` | `Either b a -> Last a` | `(a -> Either c b) -> a -> Last b` | `crocks/Last` |
| [`eitherToMaybe`][either-maybe] | `Either b a -> Maybe a` | `(a -> Either c b) -> a -> Maybe b` | `crocks/Maybe` |
| `eitherToResult` | `Either e a -> Result e a` | `(a -> Either e b) -> a -> Result e b` | `crocks/Result` |
| `firstToAsync` | `e -> First a -> Async e a` | `e -> (a -> First b) -> a -> Async e b` | `crocks/Async` |
| `firstToEither` | `c -> First a -> Either c a` | `c -> (a -> First b) -> a -> Either c b` | `crocks/Either` |
| `firstToLast` | `First a -> Last a` | `(a -> First b) -> a -> Last b` | `crocks/Last` |
| [`firstToMaybe`][first-maybe] | `First a -> Maybe a` | `(a -> First b) -> a -> Maybe b` | `crocks/Maybe` |
| `firstToResult` | `c -> First a -> Result c a` | `c -> (a -> First b) -> a -> Result c b` | `crocks/Result` |
| `lastToAsync` | `e -> Last a -> Async e a` | `e -> (a -> Last b) -> a -> Async e b` | `crocks/Async` |
| `lastToEither` | `c -> Last a -> Either c a` | `c -> (a -> Last b) -> a -> Either c b` | `crocks/Either` |
| `lastToFirst` | `Last a -> First a` | `(a -> Last b) -> a -> First b` | `crocks/First` |
| [`lastToMaybe`][last-maybe] | `Last a -> Maybe a` | `(a -> Last b) -> a -> Maybe b` | `crocks/Maybe` |
| `lastToResult` | `c -> Last a -> Result c a` | `c -> (a -> Last b) -> a -> Result c b` | `crocks/Result` |
| `listToArray` | `List a -> [ a ]` | `(a -> List b) -> a -> [ b ]` | `crocks/List` |
| `maybeToAsync` | `e -> Maybe a -> Async e a` | `e -> (a -> Maybe b) -> a -> Async e b` | `crocks/Async` |
| `maybeToEither` | `c -> Maybe a -> Either c a` | `c -> (a -> Maybe b) -> a -> Either c b` | `crocks/Either` |
| `maybeToFirst` | `Maybe a -> First a` | `(a -> Maybe b) -> a -> First b` | `crocks/First` |
| `maybeToLast` | `Maybe a -> Last a` | `(a -> Maybe b) -> a -> Last b` | `crocks/Last` |
| `maybeToResult` | `c -> Maybe a -> Result c a` | `c -> (a -> Maybe b) -> a -> Result c b` | `crocks/Result` |
| `resultToAsync` | `Result e a -> Async e a` | `(a -> Result e b) -> a -> Async e b` | `crocks/Async` |
| `resultToEither` | `Result e a -> Either e a` | `(a -> Result e b) -> a -> Either e b` | `crocks/Either` |
| `resultToFirst` | `Result e a -> First a` | `(a -> Result e b) -> a -> First b` | `crocks/First` |
| `resultToLast` | `Result e a -> Last a` | `(a -> Result e b) -> a -> Last b` | `crocks/Last` |
| [`resultToMaybe`][result-maybe] | `Result e a -> Maybe a` | `(a -> Result e b) -> a -> Maybe b` | `crocks/Maybe` |
| `writerToPair` | `Writer m a -> Pair m a` | `(a -> Writer m b) -> a -> Pair m b` | `crocks/Pair` |

[either-maybe]: ../crocks/Maybe.html#eithertomaybe
[first-maybe]: ../crocks/Maybe.html#firsttomaybe
[last-maybe]: ../crocks/Maybe.html#lasttomaybe
[result-maybe]: ../crocks/Maybe.html#resulttomaybe
