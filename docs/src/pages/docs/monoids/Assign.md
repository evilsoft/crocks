---
title: "Assign"
description: "Assign Monoid"
layout: "guide"
weight: 30
---

```haskell
Assign Object
```

`Assign` is a `Monoid` that will combine (2) objects under assignment using
`Object.assign` on the (2) `Object`s.

```javascript
const Assign = require('crocks/Assign')

const first = { name: 'Bob' }
const last = { lastName: 'Smith' }

Assign(first)
  .concat(Assign(last))
//=> Assign { name: 'Bob', lastName: 'Smith' }
```

<article id="topic-implements">

## Implements

`Semigroup`, `Monoid`

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Assign.empty :: () -> Assign
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to object other value, it will return the other value.
In the case of `Assign` the result of `empty` is an empty `Object`. `empty` is
available on both the Constructor and the Instance for convenience.

```javascript
const Assign = require('crocks/Assign')

Assign.empty()
//=> Assign {}

Assign({})
  .concat(Assign.empty())
//=> Assign {}

Assign({ a: 1 })
  .concat(Assign.empty())
//=> Assign { a: 1 }
```

#### type

```haskell
Assign.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on the
standard `crocks` types. While type comparisons can easily be done manually by
calling `type` on a given type, using the `isSameType` function hides much of
the boilerplate. `type` is available on both the Constructor and the Instance
for convenience.

```javascript
const Assign = require('crocks/Assign')
const Sum = require('crocks/Sum')
const Maybe = require('crocks/Maybe')
const isSameType = require('crocks/predicates/isSameType')

const myData =
  Assign({ name: 'Joe', age: 41 })

myData.type()
//=> "Assign"

isSameType(Sum, myData)
//=> false

isSameType(Maybe, myData)
//=> false

isSameType(Assign, myData)
//=> true
```

</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Assign ~> Assign -> Assign
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Assign`, it will
combine (2) objects, overwriting the first `Object`'s previous values with
the values of the second `Object`.

```javascript
const Assign = require('crocks/Assign')

Assign({})
  .concat(Assign({}))
//=> Assign {}

Assign({ a: 1 })
  .concat(Assign({ b: 2 }))
//=> Assign { a: 1, b: 2 }

Assign({ a: 1, b: 2 })
  .concat(Assign({ a: 3, b: 4 }))
//=> Assign { a: 3, b: 4 }

Assign({ b: 4 })
  .concat(Assign({ a: 1 }))
//=> Assign { b: 4, a: 1 }
```

#### valueOf

```haskell
Assign ~> () -> Object
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction.
While the extraction is available, types that implement `valueOf` are
not necessarily a `Comonad`. This function is used primarily for convenience
for some of the helper functions that ship with `crocks`. Calling `valueOf`
on an `Assign` instance will result in the underlying `Object`.

```javascript
const Assign = require('crocks/Assign')

Assign({})
  .valueOf()
//=> {}

Assign({ a: 1 })
  .valueOf()
//=> { a: 1 }

Assign({ a: 1 })
  .concat({ b: 25 })
  .valueOf()
//=> { a: 1, b: 25 }
```

</article>
