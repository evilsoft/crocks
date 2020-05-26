---
title: "Writer"
description: "Writer Crock"
layout: "guide"
functions: ["log", "read"]
weight: 160
---


```haskell
Monoid m => Writer m a
```

The `Writer` monad makes it possible to represent and compose computations 
that produce some additional data along with their computed values. `Writer` 
is a `Product` type that consists of a `Monoid` as the first value that 
typically holds metadata, while the second value holds the result of a 
computation. 

<article id="topic-implements">

## Implements
`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Writer :: MonoidTypeRep M, Monoid m => M -> (m, a) -> Writer m a
```

`Writer` is a type constructor that takes a `Monoid` constructor and returns 
a new constructor. The new constructor is a binary function that accepts a 
`Monoid` instance and a value `a`, and returns a `Writer` instance.

```javascript
import Writer from 'crocks/Writer'

// StringWriter :: Writer String a
const StringWriter =  Writer(String)

StringWriter('zero', 0)
// Writer String Number

StringWriter('adding inputs', (a, b) => a + b)
// Writer String Number
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### of 

```haskell
Writer.of :: a -> Writer m a
```

`of` is a construction helper that can be used to construct an `Writer` with 
any given value, with an empty instance of the `Monoid` that was passed to 
the type constructor.

```javascript
import Writer from 'crocks/Writer'

import List from 'crocks/List'

// StringWriter :: Writer List a
const ListWriter =  Writer(List)

ListWriter.of(42)
// Writer List Number
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Writer m a ~> b -> Boolean
```

Used to compare the underlying values of two `Writer` instances for equality 
by value, `equals` takes any given argument and returns `true` if the passed 
argument is a `Writer` with an underlying value equal to the underlying 
value of the `Writer` the method is being called on. If the passed argument is 
not a `Writer` instance or if the underlying values are not equal, `equals` 
will return false.

```javascript
import Assign from 'crocks/Assign'
import Writer from 'crocks/Writer'

import equals from 'crocks/pointfree/equals'

// AssignWriter :: Writer Assign a
const AssignWriter =  Writer(Assign)

AssignWriter.of(2)
  .equals(AssignWriter.of(2))
//=> true

AssignWriter(Assign({ a: 20 }), null)
  .equals(AssignWriter(Assign({ a: 30 }), null))
//=> true

Writer(String)('here is 42', { value: 42 })
  .equals(Writer(String)('also 42', { value: 42 }))
//=> true

Writer(String)('hello', 25)
  .equals(Writer(String)('hello', 26))
//=> false

equals(Writer(Array).of('result'), 'result')
//=> false
```

#### map

Used to apply transformations to the value that a `Writer` holds, `map` takes 
a function that it will lift into the context of the `Writer` and apply to it 
to the wrapped value. 

```javascript
import Sum from 'crocks/Sum'
import Writer from 'crocks/Writer'

// toLower :: String -> String
const toLower = x =>
  x.toLowerCase()

Writer(Sum).of('HELLO!')
  .map(toLower)
//=> Writer( Sum 0 "hello!" )

Writer(String)('file was loaded', 'important text from document')
  .map(contents => contents.length)
//=> Writer("file was loaded"  28)
```

#### ap

Short for apply, `ap` is used to apply a `Writer` instance containing a value 
to another `Writer` instance that contains a function, resulting in new 
`Writer` instance comprising of the result of concatenating the monoid 
instances, and the value derived from applying the function. `ap` requires 
that it is called on a writer that wraps a curried polyadic function as 
its value.

```javascript
import Sum from 'crocks/Sum'
import Writer from 'crocks/Writer'

import curry from 'crocks/helpers/curry'
import liftA2 from 'crocks/helpers/liftA2'

// SumWriter :: Writer Sum a
const SumWriter = Writer(Sum)

// slash :: Writer Number String
const slash = SumWriter(Sum(3), 'sword')

// slash :: Writer Number String
const burn = SumWriter(Sum(7), 'fireball')

// doubleAttack :: NumberRec -> NumberRec -> NumberRec
const doubleAttack = liftA2(x => y => `You unleash a ${x} and ${y} combo`)

doubleAttack(slash, burn)
//=> Writer( Sum 10 "You unleash a sword and fireball combo" )

const LogWriter = Writer(Array)

// add :: Number -> Number -> Number
const add = curry((x, y) => x + y)

// addPercentage :: Number -> Number -> Number
const addPercentage =
  curry((percentage, amount) => amount + percentage * amount)

// includeVatWithLog :: Number -> Writer [Number]
const includeVatWithLog = (amount) =>
  LogWriter([ 'adding vat' ], addPercentage(0.19, amount))

// includeVatWithLog :: Number -> Writer [Number]
const includeExpressShippingWithLog = (amount) =>
  LogWriter([ 'adding express shipping' ], add(3.99, amount))

// includeVatWithLog :: Number -> Writer [Number]
const getFinalAmount = (amount) => LogWriter.of(add)
  .ap(includeVatWithLog(amount))
  .ap(includeExpressShippingWithLog(amount))

getFinalAmount(100)
//=> Writer( [ "adding vat", "adding express shipping" ] 222.99 )
```

#### chain

```haskell
Monoid m => Writer m a ~> (a -> Writer m b) -> Writer m b
```
Combining a sequential series of transformations that allows for custom
accumulation in addition to transforming a value. `chain` requires
a `Writer` returning function that contains a `Monoid` in its first position.
An additional requirement, is that instances of the same `Monoid` must
occupy the first position of the source `Writer` and the `Writer` returned by 
the function.

```javascript
import Writer from 'crocks/Writer'
import List from 'crocks/List'

// ListWriter :: Writer List a
const ListWriter = Writer(List)

// add :: Number -> Number -> Number
const add = x => y => ListWriter(List.of(`adding ${y} to ${x}`), y + x)

// multiply :: Number -> Number -> Number
const multiply = x => y =>
  ListWriter(List.of(`multiplying ${y} by ${x}`), y * x)

// pow :: Number -> Number -> Number
const pow = x => y =>
  ListWriter(List.of(`${y} to the power of ${x}`), Math.pow(y, x))

// flow :: Number -> Writer List Number
const flow = x => ListWriter.of(x)
  .chain(add(5))
  .chain(multiply(3))
  .chain(pow(3))

flow(5)
//=> Writer(
//  List [ "adding 5 to 5", "multiplying 10 by 3", "30 to the power of 3" ]
// 27000 )

flow(-3)
//=> Writer(
// List [ "adding -3 to 5", "multiplying 2 by 3", "6 to the power of 3" ]
// 216 )
```

#### read

```haskell
Monoid m => Writer m b ~> () -> Pair m b
```

`read` extracts the contents of a writer into a `Pair` with the `log` portion 
in the first position and the `resultant` in the second.

```javascript
import Min from 'crocks/Min'
import Writer from 'crocks/Writer'

Writer(Min)(Min(100), 'value')
  .read()
//=> Pair( Min 100, "value" )
```

#### log

```haskell
Monoid m => Writer m b ~> () -> m
```

`log` is a projection method used to extract the value of the `Monoid` part 
of a `Writer` instance. 

```javascript
import Sum from 'crocks/Sum'
import Writer from 'crocks/Writer'

Writer(String)('meaning of life', 42)
  .log()
//=> "meaning of life"

Writer(Sum)(Sum(29), { damage: 25, buffs: 4 })
  .log()
//=> Sum 29
```

</article>

<article id="topic-pointfree">

## Pointfree Functions

#### read (pointfree)

```haskell
read :: Monoid m => Writer m a -> Pair m a
```

The `read` pointfree function is used to transform the `Writer` instance into 
a `Pair` containing the `log` portion on the left and the `resultant` on the 
right. `read` invokes the [`read`](#read) method on a given `Writer` instance.

```javascript
import Sum from 'crocks/Sum'
import Writer from 'crocks/Writer'
import read from 'crocks/Writer/read'

import fanout from 'crocks/Pair/fanout'

// SumWriter :: Writer Sum a
const SumWriter =
  Writer(Sum)

// appendItem :: a -> [ a ] -> SumWriter [ a ]
const appendItem = item => xs =>
  SumWriter(Sum(1), xs.concat([ item ]))

SumWriter(Sum(0), [])
  .chain(appendItem('one'))
  .chain(appendItem('two'))
  .chain(appendItem('three'))
//=> Writer( Sum 3 [ "one", "two", "three" ] )

read(SumWriter(Sum(2), 'result'))
//=> Pair(Sum 2, 'result')

fanout(Sum, x => appendItem(x)([ x ]), 1)
  .chain(read)
//=> Pair( Sum 2, [ 1, 1 ] )
```

#### log (pointfree)

```haskell
log :: Monoid m => Writer m a -> m
```

The `log` pointfree function is used to extract the `Monoid` portion of 
a `Writer` by invoking the [`log`](#log) method on a given instance. 
`log` takes a `Writer` as its only argument.

 ```javascript
import Writer from 'crocks/Writer'
import log from 'crocks/Writer/log'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import propEq from 'crocks/predicates/propEq'

// StringWriter :: Writer String a
const StringWriter = Writer(String)

// withLog :: String -> a -> Writer String a
const withLog = log => resultant => StringWriter(log, resultant)

// withLog :: Object -> Writer String a
const isLaunchSuccessful = ifElse(
   propEq('status', 'success'),
   withLog('The launch was successful'),
   withLog('Abort! Abort! Abort!')
)

// getReport :: Object -> String
const getReport = compose(
   log,
   isLaunchSuccessful
)

getReport({ status: 'failure' })
//=> "Abort! Abort! Abort!"

getReport({ status: 'success' })
//=> 'The launch was successful'
```

</article>
