---
title: "Either"
description: "Either Crock"
layout: "guide"
functions: ["firsttoeither", "lasttoeither", "maybetoeither", "resulttoeither"]
weight: 40
---

```haskell
Either c a = Left c | Right a
```

`Either` is the canonical `Sum` type and is the base of all other `Sum` types
included in `crocks`, such as [`Maybe`][maybe] and [`Async`][async] to name a
few. Defined as a tagged union type, it captures the essence of disjunction as
it provides either a `Left` value or a `Right` value and not both.

Unlike [`Maybe`][maybe], which fixes its "left side", or [`Nothing`][nothing] to
a `()` (unit), `Either` is a functor in both it's `Left` and `Right` sides. This
allows for the ability to vary the type on either side and is akin to the
imperative `if...else` trees that are common in programming.

Like most other types in `crocks`, `Either` has a right bias in regard to
instance methods like `map`, `ap` and `chain`. This behavior can be used to
formally capture Error handling as the `Left` value will be maintained and the
operations will not be applied.

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'

const { Left, Right } = Either

// err :: a -> String
const err = val =>
  `${typeof val} is not an accepted type`

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// validate :: a -> Either String Number
const validate = ifElse(
  isNumber,
  Right,
  compose(Left, err)
)

// flow :: a -> Either String Number
const flow = compose(
  map(add(10)),
  validate
)

flow(32)
//=> Right 42

flow('32')
//=> Left "string is not an accepted type"

flow(true)
//=> Left "boolean is not an accepted type"
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Apply`, `Traversable`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Either :: a -> Either c a
```

An `Either` is typically constructed by using one of the instance constructors
provided on the `TypeRep`, [`Left`](#left) or [`Right`](#right). For consistency,
an `Either` can be constructed using its `TypeRep` as a constructor. The
constructor is a unary function that accepts any type `a` and will return a
`Right` instance, wrapping the value it was passed.

```javascript
import Either from 'crocks/Either'
import equals from 'crocks/pointfree/equals'

Either(90)
//=> Right 90

Either.of(90)
//=> Right 90

Either.Right(90)
//=> Right 90

equals(
  Either.Right([ 1, 2, 3 ]),
  Either.of([ 1, 2, 3 ])
)
//=> true

equals(
  Either.of({ a: 100 }),
  Either({ a: 100 })
)
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Left

```haskell
Either.Left :: c -> Either c a
```

[FUNC DESC]

```javascript
import Either from 'crocks/Either'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isString from 'crocks/predicates/isString'
import ifElse from 'crocks/logic/ifElse'

const { Left, Right } = Either

// yell :: String -> String
const yell =
  x => `${x.toUpperCase()}!`

// safeYell :: a -> Either a String
const safeYell =  ifElse(
  isString,
  compose(Right, yell),
  Left
)

Right('excite')
  .map(yell)
//=> Right "EXCITE!"

Left('whisper')
  .map(yell)
//=> Left "whisper"

chain(safeYell, Right('outside voice'))
//=> Right "OUTSIDE VOICE!"

chain(safeYell, Left({ level: 'inside voice' }))
//=> Left { level: 'inside voice' }
```

#### Right

```haskell
Either.Right :: a -> Either c a
```

[FUNC DESC]

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Left, Right } = Either

// validate :: (b -> Boolean) -> Either c a
const validate = pred =>
  ifElse(pred, Right, Left)

// add10 :: Number -> Number
const add10 =
  x => x + 10

Right(10)
  .map(add10)
//=> Right 20

Left('Not A Number')
  .map(add10)
//=> Left "Not A Number"

// validNumber :: b -> Either c Number
const validNumber =
  validate(isNumber)

validNumber('60')
//=> Left "60"

validNumber(null)
//=> Left null

validNumber(60)
//=> Right 60

// safeAdd10 :: b -> Either c Number
const safeAdd10 = composeK(
  compose(Right, add10),
  validNumber
)

safeAdd10([ 7 ])
//=> Left [ 7 ]

safeAdd10(null)
//=> Left null

safeAdd10(5)
//=> Right 15

// isLarge :: Number -> Either Number Number
const isLarge =
  validate(x => x >= 10)

// isLargeNumber :: b -> Either c Number
const isLargeNumber =
  composeK(isLarge, validNumber)

// add10ToLarge :: b -> Either c Number
const add10ToLarge =
  composeK(safeAdd10, isLargeNumber)

add10ToLarge()
//=> Left undefined

add10ToLarge('40')
//=> Left "40"

add10ToLarge(5)
//=> Left 5

add10ToLarge(10)
//=> Right 20
```

#### of

```haskell
Either.of :: a -> Either c a
```

[FUNC DESC]

```javascript
import Either from 'crocks/Either'

const { Right } = Either

Either.of('some string')
//=> Right "some string"

Either.of(undefined)
//=> Right undefined

Either('some string')
//=> Right "some string"

Either(undefined)
//=> Right undefined

Right('some string')
//=> Right "some string"

Right(undefined)
//=> Right undefined
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Either c a ~> b -> Boolean
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'
import equals from 'crocks/pointfree/equals'

const { Left, Right } = Either

Right(null)
  .equals(Right(null))
//=> true

Left('happy')
  .equals(Left('happy'))
//=> true

Left('sad')
  .equals(Right('sad'))
//=> false

// by value, not reference for most types
Right([ 1, { a: 2 }, 'string' ])
  .equals(Right([ 1, { a: 2 }, 'string' ]))
//=> true

equals(Right('sad'), 'sad')
//=> false
```

#### concat

```haskell
Semigroup s => Either c s ~> Either c s -> Either c s
```

[ METHOD DESC ]

```javascript

import Either from 'crocks/Either'

import Assign from 'crocks/Assign'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import isObject from 'crocks/predicates/isObject'
import mapReduce from 'crocks/helpers/mapReduce'

const { Left, Right } = Either

Right([ 1, 2 ])
  .concat(Right([ 4, 5 ]))
//=> Right [ 1, 2, 3, 4 ]

Right([ 1, 2 ])
  .concat(Left('Error'))
//=> Left "Error"

// lift :: Object -> Either c Assign
const lift =
  compose(Right, Assign)

// liftObject :: b -> Either c Assign
const liftObject =
  ifElse(isObject, lift, Left)

// Foldable f => fold :: f * -> Either * Assign
const fold = mapReduce(
  liftObject,
  flip(concat),
  Either(Assign.empty())
)

fold([ { a: 'a' }, { b: 'b' } ])
//=> Right Assign { a: "a", b: "b" }

fold([
  { a: 'a' }, null, { c: 'c' }
])
//=> Left null
```

#### map

```haskell
Either c a ~> (a -> b) -> Either c b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// add :: Number -> Number -> Number
const add =
  x => y => x + y

Right(25)
  .map(add(10))
//=> Right 35

Left('Some String')
  .map(add(10))
//=> Left "Some String"

// numberOr :: a -> Either b Number
const numberOr = ifElse(
  isNumber, Right, Left
)

// add10 -> a -> Either b Number
const add10 = compose(
  map(add(10)),
  numberOr
)

add10(45)
//=> Right 55

add10('some string')
//=> Left "some string"

const processResult = compose(
  map(compose(objOf('result'), add(20))),
  numberOr
)

processResult({ a: 57 })
//=> Left { a: 57 }

processResult(57)
//=> Right{ result: 77 }
```

#### alt

```haskell
Either c a ~> Either c a -> Either c a
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

const { Left, Right } = Either

Right(45)
  .alt(Right(97))
  .alt(Left(false))
//=> Right 45

Left('String')
  .alt(Left('Another String'))
  .alt(Left('Final String'))
//=> Left "Final String"

Left('error')
  .alt(Right({ passed: true }))
//=> Right { passed: true }
```

#### bimap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either d b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import bimap from 'crocks/pointfree/bimap'
import compose from 'crocks/helpers/compose'
import ifElse from 'crocks/logic/ifElse'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// lte :: Number -> Number -> Boolean
const lte =
  x => y => y <= x

// gt10 :: Number -> Either Number Number
const gt10 =
  ifElse(lte(10), Left, Right)

// offsetBy :: Number -> Number -> Number
const offsetBy =
  x => y => x + y

// scaleBy :: Number -> Number -> Number
const scaleBy =
  x => y => x * y

// compute :: Number -> Either Number Number
const compute = compose(
  bimap(scaleBy(10), offsetBy(10)),
  gt10
)

compute(10)
//=> Left 100

compute(20)
//=> Right 30

// arrayOf :: a -> [ a ]
const arrayOf =
  x => [ x ]

// resultOf :: a -> { result: a }
const resultOf =
  objOf('result')

// format :: Either c a -> Either [ c ] { result: a }
const format =
  bimap(arrayOf, resultOf)

format(Left(100))
//=> Left [ 100 ]

format(Right(30))
//=> Right { result: 30 }

// processAndFormat :: Either Number Number -> Either [ Number ] { result: Number }
const processAndFormat = bimap(
  compose(arrayOf, scaleBy(10)),
  compose(resultOf, offsetBy(10))
)

// flow :: Number -> Either [ Number ]
const flow = compose(
  processAndFormat,
  gt10
)

flow(10)
//=> Left [ 100 ]

flow(20)
//=> Right { result: 30 }
```

#### ap

```haskell
Either c (a -> b) ~> Either c a -> Either c b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import assign from 'crocks/helpers/assign'
import assoc from 'crocks/helpers/assoc'
import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import ifElse from 'crocks/logic/ifElse'
import isObject from 'crocks/predicates/isObject'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// objectOr :: a -> Either c Object
const objectOr =
  ifElse(isObject, Right, Left)

// Error :: { error: a, passed: Boolean }
// error :: a -> Error
const error = compose(
  assoc('passed', false),
  objOf('error')
)

// setPassed :: Either c Object -> Either Error Object
const setPassed = m =>
  Either.of(assoc('passed', true))
    .ap(m)
    .bimap(error, identity)

setPassed(Right({ a: 'awesome' }))
//=> Right { a: "awesome", passed: true }

setPassed(Left({ a: 'not so much' }))
//=> Left { error: "not so much", passed: false }

// process :: a -> Either Object Object
const process =
  compose(setPassed, objectOr)

process({ a: 'awesome' })
//=> Right { a: "awesome", passed: true }

process('I am string')
//=> Left { error: "I am string", passed: false }

// assignOr :: (Either c Object, Either c Object) -> Either c Object
const assignOr = (x, y) =>
  x.map(assign).ap(y)

assignOr(Right({ b: 'also awesome' }), Right({ a: 'awesome' }))
//=> Right { a: "awesome", b: "also awesome" }

assignOr(Right({ b: 'also awesome' }), Left('not so awesome'))
//=> Left "not so awesome"

assignOr(Left({ b: 'first' }), Left({ b: 'second' }))
//=> Left { b: "first" }
```

#### sequence

```haskell
Apply f => Either c (f a) ~> (b -> f b) -> f (Either c a)
Applicative f => Either c (f a) ~> TypeRep f -> f (Either c a)
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import Identity from 'crocks/Identity'

const { Left, Right } = Either

// arrayOf :: a -> [ a ]
const arrayOf =
  x => [ x ]

Right([ 1, 2, 3 ])
  .sequence(arrayOf)
//=> [ Right 1, Right 2, Right 3 ]

Left('no array here')
  .sequence(arrayOf)
//=> [ Left "no array here" ]

Right(Identity.of(42))
  .sequence(Identity)
//=> Identity (Right 42)

Left(0)
  .sequence(Identity)
//=> Identity (Left 0)
```

#### traverse

```haskell
Apply f => Either c a ~> (d -> f d), (a -> f b)) -> f Either c b
Applicative f => Either c a ~> (TypeRep f, (a -> f b)) -> f Either c b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import Pair from 'crocks/Pair'
import State from 'crocks/State'
import Sum from 'crocks/Sum'
import constant from 'crocks/combinators/constant'
import ifElse from 'crocks/logic/ifElse'
import traverse from 'crocks/pointfree/traverse'

const { Left, Right } = Either
const { get } = State

// tallyOf :: a -> [ a ]
const tallyOf =
  x => Pair(Sum.empty(), x)

// incBy :: Number -> Pair Sum Number
const incBy =
  x => Pair(Sum(x), x)

Right(12)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 12, Right 12 )

Left(true)
  .traverse(tallyOf, incBy)
//=> Pair( Sum 0, Left true )

// lte10 :: Number -> Either Number Number
const lte10 =
  ifElse(x => x <= 10, Right, Left)

// update :: Number -> State Number Number
const update = x =>
  State.modify(state => x + state)
    .chain(constant(get()))

// updateSmall :: () => State Number Number
const updateSmall = () =>
  get(lte10)
    .chain(traverse(State, update))

updateSmall()
  .runWith(3)
//=> Pair( Right 6, 6 )

updateSmall()
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Left 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(3)
//=> Pair( Left 12, 12 )

updateSmall()
  .chain(updateSmall)
  .chain(updateSmall)
  .runWith(30)
//=> Pair( Left 30, 30 )
```

#### chain

```haskell
Either c a ~> (a -> Either c b) -> Either c b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import maybeToEither from 'crocks/Either/maybeToEither'
import prop from 'crocks/Maybe/prop'
import propEq from 'crocks/predicates/propEq'

const { Left, Right } = Either

// lift :: (b -> Boolean) -> b -> Either c a
const lift = pred =>
  ifElse(pred, Right, Left)

// isPassed :: b -> Either c Object
const isPassed =
  lift(propEq('passed', true))

isPassed({ value: 'Nope' })
// Left { value: "Nope" }

isPassed({ value: 'yes', passed: true })
// Right { value: "yes", passed: true }

// stringOr :: b -> Either c String
const stringOr =
  lift(isString)

// valueOr :: b -> Either c a
const valueOr = x =>
  maybeToEither(x, prop('value'), x)

// getStringValue :: b -> Either c String
const getStringValue = x =>
  isPassed(x)
    .chain(valueOr)
    .chain(stringOr)

getStringValue({
  value: 'So good',
  passed: true
})
//=> Right "So Good"

getStringValue({
  value: 'Not passed'
})
//=> Left { value: "Not passed" }

getStringValue({
  value: 33,
  passed: true
})
//=> Right "So Good"

getStringValue({
  value: 33,
  passed: true
})
//=> Left 33
```

#### coalesce

```haskell
Either c a ~> ((c -> b), (a -> b)) -> Either c b
```

[ METHOD DESC ]

```javascript
import Either from 'crocks/Either'

import assoc from 'crocks/helpers/assoc'
import coalesce from 'crocks/pointfree/coalesce'
import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import hasProp from 'crocks/predicates/hasProp'
import ifElse from 'crocks/logic/ifElse'
import map from 'crocks/pointfree/map'
import mapProps from 'crocks/helpers/mapProps'

const { Left, Right } = Either

// inc :: Number -> Number -> Number
const inc =
  x => x + 1

Right(45)
  .coalesce(identity, inc)
//=> Right 46

Left(45)
  .coalesce(identity, inc)
//=> Right 45

// Record :: { value: Number }
// hasValue :: Object -> Either Object Record
const hasValue =
  ifElse(hasProp('value'), Right, Left)

hasValue({ a: 45 })
// Left { a: 45 }

hasValue({ value: 45 })
// Right { value: 45 }

// defaultValue :: Either Object Record -> Either Object Record
const defaultValue =
  coalesce(assoc('value', 0), identity)

// incValue :: Either Object Record -> Either c Record
const incValue = compose(
  map(mapProps({ value: inc })),
  defaultValue,
  hasValue
)

incValue({ value: 45 })

//=> Right { value: 46 }

incValue({ a: 44 })
//=> Right { a: 44, value: 1 }
```

#### swap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either b d
```

[ METHOD DESC ]


```javascript
import Either from 'crocks/Either'

import identity from 'crocks/combinators/identity'
import swap from 'crocks/pointfree/swap'

const { Left, Right } = Either

// swapTypes :: Either c a -> Either a c
const swapTypes =
  swap(identity, identity)

swapTypes(Left(45))
//=> Right 45

swapTypes(Right(23))
//=> Left 23

// toString :: Number -> String
const toString =
  x => x.toString()

// toNumber :: String -> Number
const toNumber =
  x => parseInt(x)

// swapValues :: Either Number String -> Either Number String
const swapValues =
  swap(toString, toNumber)

swapValues(Left(23))
//=> Right "23"

swapValues(Right('23'))
//=> Left 23
```

#### either

```haskell
Either c a ~> ((c -> b), (a -> b)) -> b
```

Used as a means to map and extract a value from an `Either` based on the
context. `either` takes two functions as its arguments. The first will map any
the value `Left` in a left instance. While the second is used to map any `Right`
instance value. The function will return the result of whichever function is
used to map.

```javascript
import Either from 'crocks/Either'

import curry from 'crocks/helpers/curry'
import either from 'crocks/pointfree/either'
import identity from 'crocks/combinators/identity'
import objOf from 'crocks/helpers/objOf'

const { Left, Right } = Either

// toObject :: String -> Either a Object -> Object
const toObject = curry(
  key => either(objOf(key), identity)
)

toObject('num', Left(44))
//=> { num: 44 }

toObject('num', Right({ string: 'a string' }))
//=> { string: 'a string' }
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### firstToEither

`crocks/Either/firstToEither`

```haskell
firstToEither :: c -> First a -> Either c a
firstToEither :: c -> (a -> First b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### lastToEither

`crocks/Either/lastToEither`

```haskell
lastToEither :: c -> Last a -> Either c a
lastToEither :: c -> (a -> Last b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### maybeToEither

`crocks/Either/maybeToEither`

```haskell
maybeToEither :: c -> Maybe a -> Either c a
maybeToEither :: c -> (a -> Maybe b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### resultToEither

`crocks/Either/resultToEither`

```haskell
resultToEither :: Result e a -> Either e a
resultToEither :: (a -> Result e b) -> a -> Either e a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

</article>

[async]: ./Async.html
[maybe]: ./Maybe.html
[nothing]: ./Maybe.html#nothing
