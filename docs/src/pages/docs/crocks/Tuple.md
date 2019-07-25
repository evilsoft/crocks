---
title: "Tuple"
description: "Tuple Crock"
layout: "guide"
functions: ["nmap", "tupletoarray"]
weight: 150
---

```haskell
Tuple(n) = n-Tuple *...n
```

`Tuple` provides a means to construct a Product Type of an arbitrary size.
This allows types to be defined with as many independent values as needed for
a given flow.

```javascript
import Tuple from 'crocks/Tuple'

import First from 'crocks/First'
import Sum from 'crocks/Sum'

import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import mapReduce from 'crocks/helpers/mapReduce'
import merge from 'crocks/pointfree/merge'
import nmap from 'crocks/Tuple/nmap'
import option from 'crocks/pointfree/option'
import propEq from 'crocks/predicates/propEq'
import valueOf from 'crocks/pointfree/valueOf'

// Triple :: 3-Tuple
const Triple = Tuple(3)

// EventRecord :: { event: String, payload: a }
// ReportTriple :: Triple Sum Sum (First Boolean)

// data :: [ EventRecord ]
const data = [
  { event: 'start', payload: '' },
  { event: 'answer', payload: { id: 4, correct: true } },
  { event: 'answer', payload: { id: 2, correct: false } },
  { event: 'answer', payload: { id: 5, correct: false } },
  { event: 'stop', payload: '' },
  { event: 'start', payload: '' },
  { event: 'answer', payload: { id: 1, correct: true } },
  { event: 'answer', payload: { id: 3, correct: true } },
  { event: 'complete', payload: { passed: true } },
  { event: 'stop', payload: '' }
]

// trimap :: (a -> d) -> (b -> e) -> (c -> f) -> Triple a b c -> Triple d e f
const trimap =
  nmap(3)

// reportEmpty :: () -> ReportTriple
const reportEmpty = () =>
  Triple(Sum.empty(), Sum.empty(), First.empty())

// encodeCorrect :: EventRecord -> Sum
const encodeCorrect = ifElse(
  propEq('correct', true),
  constant(Sum(1)),
  Sum.empty
)

// encode :: EventRecord -> ReportTriple
const encode = ({ event, payload }) => {
  switch (event) {
  case 'stop':
    return Triple(
      Sum(1), Sum.empty(), First.empty()
    )

  case 'answer':
    return Triple(
      Sum.empty(), encodeCorrect(payload), First.empty()
    )

  case 'complete':
    return Triple(
      Sum.empty(), Sum.empty(), First(true)
    )
  }

  return reportEmpty()
}

// extract :: ReportTriple -> Triple Number Number Boolean
const extract =
  trimap(valueOf, valueOf, option(false))

// decode :: (Number, Number, Boolean) -> Object
const decode = (attempts, correct, complete) =>
  ({ attempts, correct, complete })

// foldReport :: [ EventRecord ] -> ReportTriple
const foldReport = mapReduce(
  encode,
  flip(concat),
  reportEmpty()
)

// calculate :: [ EventRecord ] -> Object
const calculate = compose(
  merge(decode),
  extract,
  foldReport
)

calculate(data)
//=> { attempts: 2, correct: 3, complete: true }
```

<article id="topic-implements">

## Implements

`Setoid`, `Semigroup`, `Functor`

</article>

<article id="topic-construction">

## Construction

```haskell
Tuple :: Number -> n-Tuple *...n
```

`Tuple` is a type constructor that takes a non-zero, positive `Integer` as its
argument. Instead of an instance, it will return a constructor that is used
to construct an `n` sized `Tuple`, where `n` is the number of independent values
that can be represented.

The resulting `n-Tuple` constructor is parameterized as an `n-Functor`, where
each parameter can vary from instance to instance.

```javascript
import Tuple from 'crocks/Tuple'

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

// Quad :: 4-Tuple
const Quad =
  Tuple(4)

Triple(false, true, 45)
//=> 3-Tuple (false, true, 45)

Quad({ a: true }, [ 1, 2, 3 ], 60, 'string')
//=> 4-Tuple ({ a: true }, [ 1, 2, 3 ], 60, "string")
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
n-Tuple *...n ~> a -> Boolean
```

Used to compare the values of two `n-Tuple` instances by value.`equals` takes
any given argument and will return a `true` if passed an `n-Tuple` of the same
size with match values in the same positions as the `n-Tuple` `equals` was
run on. If the provided argument is not an `n-Tuple` of the same type or the
underlying values are not equal, then `equals` will return `false`.


```javascript
import Tuple from 'crocks/Tuple'

// Pair :: 2-Tuple
const Pair =
  Tuple(2)

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

Pair(1, false)
  .equals(Pair(1, false))
//=> true

Triple(1, false, [ 1, 2 ])
  .equals(Triple(1, false, [ 1, 2 ]))
//=> true

Triple(1, false, [ 1, 2 ])
  .equals(Triple(1, true, [ 3, 4 ]))
//=> false

Pair(1, false)
  .equals(Triple(1, false, [ 1, 2 ]))
//=> false
```

#### concat

```haskell
Semigroup s1 => 1-Tuple s1 ~> 1-Tuple s1 -> 1-Tuple s1
Semigroup s1, s2 => 2-Tuple s1 s2 ~> 2-Tuple s1 s2 -> 2-Tuple s1 s2
...
```

Two instances of the same `n-Tuple` can be combined using concatenation, as
long as both have instances of the same `Semigroup`s in the same
position. `concat` will be called on each contained `Semigroup` instance with
the instance corresponding to the other `n-Tuple` instance. The result of each
concatenation will be provided in a new `n-Tuple` instance.

```javascript
import Tuple from 'crocks/Tuple'
import Sum from 'crocks/Sum'

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

// Unary :: 1-Tuple
const Unary =
  Tuple(1)

Triple([ 1, 3 ], Sum(10), Sum(1))
  .concat(Triple([ 4 ], Sum.empty(), Sum(9)))
//=> 3-Tuple( [ 1, 3, 4 ], Sum 10, Sum, 10 )

Unary([ 10 ])
  .concat(Unary([ 10 ]))
//=> 1-Tuple( [ 10, 10 ] )
```

#### map

```haskell
1-Tuple a ~> (a -> b) -> 1-Tuple b
2-Tuple a b ~> (b -> c) -> 2-Tuple a c
...
```

Used to lift a single function into a given `n-Tuple` to map the rightmost
value. `map` takes a function `(a -> b)` and will return a
new `n-Tuple` instance with the result of mapping the rightmost value from its
original `a` type to the resulting `b`.

This method will only apply to the rightmost value. [`mapAll`](#mapall) can be
used to map over all values in a given `n-Tuple`.

```javascript
import Tuple from 'crocks/Tuple'

import Maybe from 'crocks/Maybe'
import chain from 'crocks/pointfree/chain'
import getProp from 'crocks/Maybe/getProp'

const { Just } = Maybe

// Pair :: 2-Tuple
const Pair =
  Tuple(2)

Pair(false, Just({ a: 'this is a' }))
  .map(chain(getProp('a')))
//=> 2-Tuple( false, Just "this is a" )
```

#### mapAll

```haskell
1-Tuple a ~> (a -> b) -> 1-Tuple b
2-Tuple a b ~> (a -> c) -> (b -> d) -> 2-Tuple c d
...
```

While [`map`](#map) allows for the rightmost portion of a given `n-Tuple` to be
mapped, `mapAll` provides a means to map all values at once, independently of
each other. A `Tuple` of `n` size requires `n` number of functions in the same
left to right order as their respective values. `mapAll` returns a
new `n-Tuple` of the same size containing the results of the provided mapping
functions.

```javascript
import Tuple from 'crocks/Tuple'
import objOf from 'crocks/helpers/objOf'

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// negate :: a -> Boolean
const negate =
  x => !x

Triple('little', false, 94)
  .mapAll(toUpper, negate, objOf('a'))
//=> 3-Tuple( "LITTLE", true, { a: 94 } )
```

#### project

```haskell
1-Tuple a ~> Integer -> a
2-Tuple a b ~> Integer -> (a | b)
3-tuple a b c ~> Integer -> (a | b | c)
...
```

Used to extract a specific value from a given `n-Tuple`. `project` takes a
positive, non-zero `Integer` as its input and will return the extracted value
residing in the provided 1 based index.

```javascript
import Tuple from 'crocks/Tuple'

// Pair :: 2-Tuple
const Pair =
  Tuple(2)

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

Triple('one', 'two', 'three')
  .project(1)
//=> "one"

Pair('one', 'two')
  .project(2)
//=> "two"
```

#### merge

```haskell
1-Tuple a ~> (a -> b) -> b
2-Tuple a b ~> ((a, b) -> c) -> c
3-Tuple a b c ~> ((a, b, c) -> d) -> d
...
```

Used to fold a given `n-Tuple` into a single value, `merge` accepts a function
of any arity and will apply each value in the `n-Tuple`, in order, to the
provided function. `merge` returns the result of the application.

When using an `n-Tuple` to manage parallel processing, `merge` is used to
combine the separate branches into a single result.

```javascript
import Tuple from 'crocks/Tuple'
import curry from 'crocks/helpers/curry'

// Triple :: 3-Tuple
const Triple =
  Tuple(3)

// buildObj :: (a, b, c) -> Object
const buildObj = curry(
  (first, second, third) =>
    ({ first, second, third })
)

Triple(99, 'name', [ 1, 5, 7 ])
  .merge(buildObj)
//=> { first: 99, second: "name", third: [ 1, 5, 7 ] }
```

#### toArray

```haskell
1-Tuple a ~> () -> [ a ]
2-Tuple a b ~> () -> [ a + b ]
3-Tuple a b c ~> () -> [ a + b + c ]
...
```

`toArray` is a Natural Transformation from a given `n-Tuple` to a
JavaScript `Array`. Any arguments applied to `toArray` will be ignored and will
return an Array of `n` size, where `n` corresponds to the size of
the `n-Tuple`. Each value will be in the same left to right position as the
order defined by the `n-Tuple`

```javascript
import Tuple from 'crocks/Tuple'

// Pair :: 2-Tuple
const Pair =
  Tuple(2)

// Quad :: 4-Tuple
const Quad =
  Tuple(4)

Pair(false, { a: false })
  .toArray()
//=> [ false, { a: false } ]

Quad([ 1, 3 ], [ 2, 4 ], 'name', 'Joe')
  .toArray()
//=> [ [ 1, 3 ], [ 2, 4 ], "name", "Joe" ]
```

</article>

<article id="topic-pointfree">

## Pointfree Functions

#### nmap

`crocks/Tuple/nmap`

```haskell
nmap :: Integer -> ...(* -> *) -> m ...* -> m ...*
```

`nmap` takes a non-zero, positive `Integer` as its argument and will return
another function that takes the same number of unary functions as
the provided `Integer`. After all functions are provided, the last argument
needs to be an `n-Tuple` of the same size as the provided `Integer`.

```javascript
import Tuple from 'crocks/Tuple'
import nmap from 'crocks/Tuple/nmap'

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// Pair :: 2-Tuple a b
const Pair =
  Tuple(2)

// Triple :: 3-Tuple a b c
const Triple =
  Tuple(3)

// bimap :: (a -> c) -> (b -> d) -> Pair a b -> Pair c d
const bimap =
  nmap(2)

// trimap :: (a -> d) -> (b -> e) -> (c -> f) -> Triple a b c -> Triple d e f
const trimap =
  nmap(3)

// pair :: Pair String Number
const pair =
  Pair('jordan', 13)

bimap(toUpper, add(10), pair)
//=> 2-Tuple( "JORDAN", 23 )

const triple =
  Triple(32, 'string', 0)

trimap(add(10), toUpper, add(10), triple)
//=> 3-Tuple( 42, "STRING", 10 )
```

#### project

`crocks/Tuple/project`

```haskell
project :: Integer -> m ...* -> a
```

`project` takes a positive, non-zero Integer as its input and returns another
function that accepts an `n-Tuple`. It then returns the value from
the `n-Tuple` that resides at the provided `Integer` index.

```javascript
import Tuple from 'crocks/Tuple'
import project from 'crocks/Tuple/project'

// Triple :: 3-Tuple
const Triple = Tuple(3)('one', 'two', 'three')

// getFirst :: Number -> a
const getFirst = project(1)

// getFirst :: Number -> a
const getSecond = project(1)

getFirst(Triple)
//=> "one"

getSecond(Triple)
//=> "two"
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### tupleToArray

`crocks/Tuple/tupleToArray`

```haskell
tupleToArray :: Tuple a -> [ a ]
tupleToArray :: (a -> Tuple b) -> a -> [ b ]
```

Used to transform a given `Tuple` instance to an `Array` instance.

Like all `crocks` transformation functions, `tupleToArray` has two possible
signatures and will behave differently when passed either
a `Tuple` instance or a function that returns an instance
of `Tuple`. When passed the instance, a transformed `Array` is
returned. When passed a `Tuple` returning function, a function will
be returned that takes a given value and returns an `Array`.

```javascript
import Tuple from 'crocks/Tuple'
import tupleToArray from 'crocks/Tuple/tupleToArray'
import constant from 'crocks/combinators/constant'

const Triple = Tuple(3)

const triple = Triple( 1, { key: 'value' }, 'string' )

tupleToArray(triple)
//=> [ 1, { key: 'value' }, 'string' ]

tupleToArray(constant(triple))()
//=> [ 1, { key: 'value' }, 'string' ]
```
</article>
