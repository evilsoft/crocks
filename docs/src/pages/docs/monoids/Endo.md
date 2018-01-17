---
title: "Endo"
description: "Endo Monoid"
layout: "guide"
weight: 40
---

```haskell
Endo a
```

`Endo` is a `Monoid` that will combine (2) functions that have matching domains
and codomains (endofunctions) under function composition. Due to the nature
of `Endo` wrapping a function, the underlying value can either be extracted
using [`valueOf`](#valueof) like any other `Monoid` or can be executed directly
using [`runWith`](#runWith), supplying the input.

```javascript
const Endo = require('crocks/Endo')

const curry = require('crocks/helpers/curry')
const mconcat = require('crocks/helpers/mconcat')
const valueOf = require('crocks/pointfree/valueOf')

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// multiply :: Number -> Number -> Number
const multiply =
  x => y => x * y

// runEndo :: Endo a -> a -> a
const runEndo =
  curry(valueOf)

// flow :: Endo Number
const addAndDouble =
  Endo(add(10))
    .concat(Endo(multiply(2)))

// always10 :: Endo Number
const always10 =
  mconcat(Endo, [ add(100), multiply(0), add(10) ])

runEndo(addAndDouble, 5)
//=> 30

always10
  .runWith(75)
//=> 10
```

<article id="topic-implements">

## Implements

`Semigroup`, `Monoid`

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Endo.empty :: () -> Endo a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Endo` the result of `empty` is the identity function, which echos
its input. `empty` is available on both the Constructor and the Instance for
convenience.

```javascript
const Endo = require('crocks/Endo')

const runWith = require('crocks/pointfree/runWith')

// empty :: Endo a
const empty = Endo.empty()

// toUpper :: Endo String
const toUpper =
  Endo(x => x.toUpperCase())

// runNice :: Endo String -> String
const runNice =
  runWith('nice')

runNice(empty.concat(toUpper))
//=> "NICE"

runNice(toUpper.concat(empty))
//=> "NICE"
```

#### type

```haskell
Endo.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on the
standard `crocks` types. While type comparisons can easily be done manually by
calling `type` on a given type, using the `isSameType` function hides much of
the boilerplate. `type` is available on both the Constructor and the Instance
for convenience.

```javascript
const Endo = require('crocks/Endo')
const Maybe = require('crocks/Maybe')

const constant = require('crocks/combinators/constant')
const identity = require('crocks/combinators/identity')
const isSameType = require('crocks/predicates/isSameType')

Endo.type() //=>  "Endo"

isSameType(Endo, Endo(identity))              //=> true
isSameType(Endo(identity), Endo(constant(3))) //=> true
isSameType(Endo(identity), Maybe)             //=> false
```

</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Endo a ~> Endo a -> Endo a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Endo`, it will combine (2)
endofunctions under function composition.

```javascript
const Endo = require('crocks/Endo')

const assoc = require('crocks/helpers/assoc')
const mapProps = require('crocks/helpers/mapProps')
const objOf = require('crocks/helpers/objOf')

// inc :: Number -> Number
const inc =
  x => x + 1

// incValue :: Endo Object
const incValue =
  Endo(mapProps({ value: inc }))

// addDone :: Endo Object
const addDone =
  Endo(assoc('done', true))

// finish :: Endo Object
const packResults =
  Endo(objOf('results'))

// finish :: Endo Object
const finish =
  incValue.concat(addDone)

finish.runWith({ value: 99 })
//=> { value: 100, done: true }

finish
  .concat(packResults)
  .runWith({ value: 99 })
//=> { results: { value: 100, done: true } }
```

#### valueOf

```haskell
Endo a ~> () -> (a -> a)
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on
an `Endo` instance will result in the underlying endofunction.

```javascript
const Endo = require('crocks/Endo')

const filter = require('crocks/pointfree/filter')
const map = require('crocks/pointfree/map')
const mconcat = require('crocks/helpers/mconcat')

// lt10 :: [ Number ] -> [ Number ]
const lt10 =
  filter(x => x < 10)

// double :: [ Number ] -> [ Number ]
const double =
  map(x => x * 2)

// buildEndo :: [ (a -> a) ] -> Endo a
const buildEndo =
  mconcat(Endo)

// fn :: [ Number ] -> [ Number ]
const fn =
  buildEndo([ lt10, double ])
    .valueOf()

fn([ 12, 5, 3, 90 ])
//=> [ 10, 6 ]

fn([])
//=> []
```

#### runWith

```haskell
Endo a ~> a -> a
```

`Endo` wraps a function and as such, its underlying endofunction can be run
while inside of an `Endo` by calling `runWith`. Providing a valid value of the
same type required by the function, `runWith` will execute the underlying
function and return the result.

```javascript
const Endo = require('crocks/Endo')

const filter = require('crocks/pointfree/filter')
const map = require('crocks/pointfree/map')
const mconcat = require('crocks/helpers/mconcat')

// lt10 :: [ Number ] -> [ Number ]
const lt10 =
  filter(x => x < 10)

// double :: [ Number ] -> [ Number ]
const double =
  map(x => x * 2)

// buildEndo :: [ (a -> a) ] -> Endo a
const flow =
  mconcat(Endo, [ lt10, double ])

flow
  .runWith([ 12, 5, 3, 90 ])
//=> [ 10, 6 ]

flow
  .runWith([])
//=> []
```

</article>
