---
title: "Pred"
description: "Pred Crock"
layout: "guide"
weight: 100
---

```haskell
Pred a Boolean
```

Defined as a Monoidal Contravariant datatype, `Pred` wraps a predicate function
of the form `(a -> Boolean)`.

The far right parameter of `Pred` is always fixed to the type of `Boolean`, so
the result of the wrapped predicate function can never be mapped. While the
right parameter is fixed, the input to the predicate can vary.

Another property of `Pred` instances is that they can be combined using their
Monodial interface. Combining instances will result in a new instance that
returns the result of each `Pred` under logical conjunction.

As `Pred` wraps a function, it is lazy and will not execute until its argument
is satisfied. A given instance is run but calling the [`runWith`](#runwith)
method, supplying it the argument to test.

One of the features of `crocks` is the ability to use both normal predicate
functions and `Pred` instances interchangeably. For any `crocks` function that
takes a predicate, either a predicate function or a `Pred` instance can be used.

This implementation of `Pred` was heavily inspired by [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a).

```javascript
const Pred = require('crocks/Pred')

const isNumber = require('crocks/predicates/isNumber')
const propOr = require('crocks/helpers/propOr')
const filter = require('crocks/pointfree/filter')

// largeNumber :: Pred Number
const largeNumber =
  Pred(isNumber)
    .concat(Pred(x => x > 100))

// largeItem :: Pred Object
const largeItem =
  largeNumber
    .contramap(propOr(null, 'item'))

largeNumber
  .runWith(45)
//=> false

largeNumber
  .runWith(175)
//=> true

largeItem
  .runWith({ item: 190 })
//=> true

largeItem
  .runWith({ item: 9 })
//=> false

largeItem
  .runWith(9)
//=> false

filter(largeNumber, [ 200, 375, 15 ])
//=> [ 200, 375 ]
```

<article id="topic-implements">

## Implements
`Semigroup`, `Monoid`, `Contravariant`

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Pred.empty :: () -> Pred a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Pred` the result of `empty` is a `Pred` that will always return
`true`. `empty` is available on both the Constructor and the Instance for
convenience.

```javascript
const Pred = require('crocks/Pred')

const isEmpty = require('crocks/predicates/isEmpty')
const not = require('crocks/logic/not')

// empty :: Pred a
const empty =
  Pred.empty()

// notEmpty :: Pred a
const notEmpty =
  Pred(not(isEmpty))

empty
  .runWith('')
//=> true

notEmpty
  .concat(empty)
  .runWith([])
//=> false

notEmpty
  .concat(empty)
  .runWith([ 1, 2, 3 ])
//=> true

empty
  .concat(notEmpty)
  .runWith('')
//=> false

empty
  .concat(notEmpty)
  .runWith('123')
//=> true
```

#### type

```haskell
Pred.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on the
standard `crocks` types. While type comparisons can easily be done manually by
calling `type` on a given type, using the `isSameType` function hides much of
the boilerplate. `type` is available on both the Constructor and the Instance
for convenience.

```javascript
const Pred = require('crocks/Pred')

const Maybe = require('crocks/Maybe')
const isNil = require('crocks/predicates/isEmpty')
const isSameType = require('crocks/predicates/isSameType')

Pred.type()   //=>  "Pred"

isSameType(Pred, Pred(isNil))    //=> true
isSameType(Pred, Pred)           //=> true
isSameType(Pred, Maybe.Just(4))  //=> false
isSameType(Pred(isNil), Maybe)   //=> false
```

</article>

<article id="topic-instance">

## Instance Methods

#### concat

```haskell
Pred a ~> Pred a -> Pred a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Pred`, the results of both
`Preds`s are combined under logical conjunction.

```javascript
const Pred = require('crocks/Pred')

const or = require('crocks/logic/or')
const not = require('crocks/logic/not')
const filter = require('crocks/pointfree/filter')

const isEven =
  x => !(x % 2)

// isOdd :: Pred Number
const isOdd =
  Pred(not(isEven))

// lt20 :: Pred Number
const lt20 =
  Pred(x => x < 20)

// gt5 :: Pred Number
const gt5 =
  Pred(x => x > 5)

// inRange :: Pred Number
const inRange =
  lt20.concat(gt5)

// isOddInRange :: Pred Number
const isOddInRange =
  isOdd.concat(inRange)

// isValid :: Pred Number
const isValid =
  Pred(or(isEven, isOddInRange))

// data :: [ Number ]
const data =
[ 1, 4, 12, 19, 32, 99, 76, 7 ]

isOdd
  .runWith(5)
//=> true

isOdd
  .runWith(8)
//=> false

filter(isOdd, data)
//=> [ 1, 19, 99, 7 ]

filter(lt20, data)
//=> [ 1, 4, 12, 19, 7 ]

filter(gt5, data)
//=> [ 12, 19, 32, 99, 76, 7 ]

filter(inRange, data)
//=> [ 12, 19, 7 ]

filter(isOddInRange, data)
//=> [ 19, 7 ]

filter(isEven, data)
// [ 4, 12, 32, 76 ]

filter(isValid, data)
//=> [ 4, 12, 19, 32, 76, 7 ]
```

#### contramap

```haskell
Pred a ~> (b -> a) -> Pred b
```

While the output of a `Pred` is fixed to `Boolean`, the input can vary type and
value. This allows a given `Pred` to be adapted by mapping on the input, before
it hits the wrapped predicate function. Using `contramap`, functions are lifted,
mapping the input to now accept the type of the input of the given function.

```javascript
const Pred = require('crocks/Pred')
const contramap = require('crocks/pointfree/contramap')
const propOr = require('crocks/helpers/propOr')

// Length :: String | Function | Array
// length :: Length -> Number
const length =
  propOr(0, 'length')

// gt5 :: Pred Number
const gt5 =
  Pred(x => x > 5)

// lengthGt5 :: Pred Length
const validLength =
  contramap(length, gt5)

// validItemLength :: Pred Object
const validItemLength =
  contramap(propOr(null, 'item'), validLength)

gt5
  .runWith(5)
//=> false

gt5
  .runWith(10)
//=> true

validLength
  .runWith([ 1, 2, 3, 4, 5, 6 ])
//=> true

validLength
  .runWith(null)
//=> false

validLength
  .runWith('1234')
//=> false

validItemLength
  .runWith({ item: 'this is an item' })
//=> true
```

#### valueOf

```haskell
Pred a ~> () -> a -> Boolean
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`.

Calling `valueOf` on a `Pred` instance will result in the underlying predicate
function. Most of the time this will not be required when working with `crocks`
because all `crocks` functions that take a predicate function can also take a
`Pred` instance.

```javascript
const Pred = require('crocks/Pred')

const isArray = require('crocks/predicates/isArray')
const isString = require('crocks/predicates/isString')
const equals = require('crocks/pointfree/equals')
const or = require('crocks/logic/or')

// lengthIsThree :: Pred a
const lengthIsThree =
  Pred(equals(3))
    .contramap(x => x.length)

// pred :: Pred a
const pred =
  Pred(or(isArray, isString))
    .concat(lengthIsThree)

// fn :: a -> Boolean
const fn =
  pred.valueOf()

pred
  .runWith(null)
//=> false

pred
  .runWith([ 1, 2, 3 ])
//=> true

pred
  .runWith('This is fun')
//=> true

fn(null)          // false
fn([ 1, 2, 3 ])   // true
fn('This is fun') // true
fn([])            // false
fn('')            // false
```

#### runWith

```haskell
Pred a ~> a -> Boolean
```

As `Pred` wraps a predicate function, it needs a mean to run it with some value
to test against the predicate. `Pred` instances provide a method called
`runWith` that will accept the value to be tested and then runs it through the
predicate returning the result.

Most of the time this function is not used while working with other predicate
functions in `crocks`, as all functions that take a predicate function also
take a `Pred` instance. It does come in handy though when supplying predicates
to other libraries.

```javascript
const Pred = require('crocks/Pred')

const hasProp = require('crocks/predicates/hasProp')
const equals = require('crocks/pointfree/equals')
const flip = require('crocks/combinators/flip')
const runWith = require('crocks/pointfree/runWith')

// trueBlue :: Pred Object
const trueBlue =
  Pred(equals(true))
    .contramap(({ blue }) => blue)

// isValid :: Pred a
const isValid =
  Pred(hasProp('blue'))
    .concat(trueBlue)

// checkValid :: a -> Boolean
const checkValid =
  flip(runWith, isValid)

checkValid(null)            //=> false
checkValid([ 1, 2, 3 ])     //=> false
checkValid({ blue: 32 })    //=> false
checkValid({ blue: true })  //=> true
```

</article>
