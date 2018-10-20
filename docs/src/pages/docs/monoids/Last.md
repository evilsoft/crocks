---
title: "Last"
description: "Last Monoid"
layout: "guide"
weight: 60
---

```haskell
Last a = Last (Maybe a)
```

`Last` is a `Monoid` that will always return the last, non-empty value when
two `Last` instances are combined. `Last` is able to be a `Monoid` because
it implements a [`Maybe`][maybe] under the hood. The use of the [`Maybe`][maybe] allows for an
[`empty`](#empty) `Last` to be represented with a `Nothing`.

`Last` can be constructed with either a value or a [`Maybe`][maybe] instance. Any value
passed to the constructor will be wrapped in a [`Just`][just] to represent a non-empty
instance of `Last`. Any [`Maybe`][maybe] passed to the constructor will be lifted as
is, allowing the ability to "choose" a value based on some disjunction.

While most `Monoid`s only provide a [`valueOf`](#valueof) function used for
extraction, `Last` takes advantage of its underlying [`Maybe`][maybe] to provide an
additional [`option`](#option) method. Using [`valueOf`](#valueof) will extract
the underlying [`Maybe`][maybe], while [`option`](#option) will extract the underlying
value in the [`Maybe`][maybe], using the provided default value when the underlying
[`Maybe`][maybe] is a [`Nothing`][nothing] instance.

```javascript
import Last from 'crocks/Last'

import and from 'crocks/logic/and'
import isNumber from 'crocks/predicates/isNumber'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

// isEven :: Number -> Boolean
const isEven =
  x => x % 2 === 0

// isValid :: a -> Boolean
const isValid =
  and(isNumber, isEven)

// chooseLast :: [ * ] -> Last Number
const chooseLast =
  mconcatMap(Last, safe(isValid))

chooseLast([ 21, 45, 2, 22, 19 ])
  .valueOf()
//=> Just 22

chooseLast([ 'a', 'b', 'c' ])
  .option('')
//=> ""
```

<article id="topic-implements">

## Implements

`Setoid`, `Semigroup`, `Monoid`

</article>

<article id="topic-construction">

## Construction

```haskell
Last :: a -> Last (Maybe a)
Last :: Maybe a -> Last (Maybe a)
```

A `Last` instance can be constructed by passing either a direct (unwrapped)
value `a` or a `Maybe a` to the constructor. When a direct value is passed, the
constructor will always wrap the value in a `Just` and return a
new `Last Just a` instance.

Alternatively, by passing a `Maybe a`, the user can programmatically provide an
empty case to a given `Last` by passing a `Nothing`.

```javascript
import Last from 'crocks/Last'
import Maybe from 'crocks/Maybe'

const { Just, Nothing } = Maybe

Last(Just([ 1, 2, 3 ]))
//=> Last( Just [ 1, 2, 3 ] )

Last(Nothing())
//=> Last( Nothing )

Last(null)
//=> Last( Just null )

Last(false)
//=> Last( Just false )
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Last.empty :: () -> Last a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Last` the result of `empty` is [`Nothing`][nothing]. `empty` is available
on both the Constructor and the Instance for convenience.

```javascript
import Last from 'crocks/Last'

const { empty } = Last

empty()
//=> Last( Nothing )

Last(3)
  .concat(empty())
//=> Last( Just 3 )

empty()
  .concat(Last(3))
//=> Last( Just 3 )
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Last a ~> b -> Boolean
```

Used to compare the underlying values of two `Last` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed argument
is a `Last` with an underlying value equal to the underlying value of
the `Last` the method is being called on. If the passed argument is not
a `Last` or the underlying values are not equal, `equals` will return `false`.

```javascript
import Last from 'crocks/Last'

import Maybe from 'crocks/Maybe'

Last(33)
  .equals(Last(33))
//=> true

Last(42)
  .equals(Last(10))
//=> false

Last({ a: 5 })
  .equals({ a: 5 })
//=> false

Last(95)
  .equals(95)
//=> false

Last(95)
  .equals(Maybe.of(95))
//=> false
```

#### concat

```haskell
Last a ~> Last a -> Last a
```

`concat` is used to combine two `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Last`, it will always provide the
last non-empty value. All previous non-empty values will be thrown away and
will always result in the last non-empty value.

```javascript
import Last from 'crocks/Last'
import concat from 'crocks/pointfree/concat'

const a = Last('a')
const b = Last('b')
const c = Last('c')

a.concat(b)
//=> Last( Just "b" )

b.concat(a)
//=> Last( Just "a" )

concat(c, concat(b, a))
//=> Last( Just "c" )

concat(concat(c, b), a)
//=> Last( Just "c" )

concat(concat(a, b), c)
//=> Last( Just "a" )
```

#### option

```haskell
Last a ~> a -> a
```

`Last` wraps an underlying [`Maybe`][maybe] which provides the ability to option out
a value in the case of an [`empty`](#empty) instance. Just like [`option`][option] on
a [`Maybe`][maybe] instance, it takes a value as its argument. When run on
an [`empty`](#empty) instance, the provided default will be returned.
If `option` is run on a non-empty instance however, the wrapped value will be
extracted not only from the `Last` but also from the underlying [`Just`][just].

If the underlying [`Maybe`][maybe] is desired, the [`valueOf`](#valueof) method can be
used and will return the [`Maybe`][maybe] instead.

```javascript
import Last from 'crocks/Last'

import compose from 'crocks/helpers/compose'
import chain from 'crocks/pointfree/chain'
import isString from 'crocks/predicates/isString'
import mconcatMap from 'crocks/helpers/mconcatMap'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

// stringVal :: a -> Maybe String
const stringVal = compose(
  chain(safe(isString)),
  prop('val')
)

// lastValid :: [ a ] -> Last String
const lastValid =
  mconcatMap(Last, stringVal)

// good :: [ Object ]
const good =
  [ { val: 23 }, { val: 'string' }, { val: '23' } ]

// bad :: [ Object ]
const bad =
  [ { val: 23 }, { val: null }, {} ]

lastValid(good)
  .option('')
//=> "23"

lastValid(bad)
  .option('')
//=> ""
```

#### valueOf

```haskell
Last a ~> () -> Maybe a
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Last` instance
will result in the underlying [`Maybe`][maybe].

```javascript
import Last from 'crocks/Last'

import Maybe from 'crocks/Maybe'
import valueOf from 'crocks/pointfree/valueOf'

const { Nothing } = Maybe

valueOf(Last(56))
//=> Just 56

valueOf(Last.empty())
//=> Nothing

Last(37)
  .concat(Last(99))
  .valueOf()
//=> Just 99

Last(Nothing())
  .concat(Last.empty())
  .valueOf()
//=> Nothing
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### eitherToLast

`crocks/Last/eitherToLast`

```haskell
eitherToLast :: Either b a -> Last a
eitherToLast :: (a -> Either c b) -> a -> Last b
```

Used to transform a given [`Either`][either] instance to a `Last`
instance, `eitherToLast` will turn a [`Right`][right] instance into a non-empty `Last`,
wrapping the original value contained in the [`Right`][right]. All [`Left`][left] instances will
map to an [`empty`](#empty) `Last`, mapping the originally contained value to
a `Unit`. Values on the [`Left`][left] will be lost and as such this transformation is
considered lossy in that regard.

Like all `crocks` transformation functions, `eitherToLast` has two possible
signatures and will behave differently when passed either an [`Either`][either] instance
or a function that returns an instance of [`Either`][either]. When passed the instance,
a transformed `Last` is returned. When passed an [`Either`][either] returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
import Last from 'crocks/Last'
import Either from 'crocks/Either'
import eitherToLast from 'crocks/Last/eitherToLast'

import concat from 'crocks/pointfree/concat'
import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import mapReduce from 'crocks/helpers/mapReduce'

const { Left, Right } = Either

// someNumber :: a -> Either String Number
const someNumber = ifElse(
  isNumber,
  Right,
  constant(Left('Nope'))
)

// lastNumber :: [ a ] -> Last Number
const lastNumber = mapReduce(
  eitherToLast(someNumber),
  flip(concat),
  Last.empty()
)

// "Bad Times" is lost, mapped to Nothing
eitherToLast(Left('Bad Times'))
//=> Last( Nothing )

eitherToLast(Right('correct'))
//=> Last( Just "correct" )

lastNumber([ 'string', null, 34, 76 ])
//=> Last( Just 76 )

lastNumber([ 'string', null, true ])
//=> Last( Nothing )
```

#### firstToLast

`crocks/Last/firstToLast`

```haskell
firstToLast :: First a -> Last a
firstToLast :: (a -> First b) -> a -> Last b
```

Used to transform a given [`First`][first] instance to
a `Last` instance, `firstToLast` will turn a non-empty instance into a
non-empty `Last` wrapping the original value contained within
the [`First`][first]. All [`empty`](#empty) instances will map to
an [`empty`](#empty) `Last`.

Like all `crocks` transformation functions, `firstToLast` has two possible
signatures and will behave differently when passed either
a [`First`][first] instance or a function that returns an instance
of [`First`][first]. When passed the instance, a transformed `Last` is returned.
When passed a [`First`][first] returning function, a function will be returned
that takes a given value and returns a `Last`.

```javascript
import Last  from 'crocks/Last'
import First from 'crocks/First'
import firstToLast from 'crocks/Last/firstToLast'

import isString from 'crocks/predicates/isString'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

// firstString :: [ a ] -> First String
const firstString =
  mconcatMap(First, safe(isString))

// unfixFirstString :: [ a ] -> Last String
const unfixFirstString =
  firstToLast(firstString)

firstToLast(First.empty())
//=> Last( Nothing )

firstToLast(First(false))
//=> Last( Just false )

unfixFirstString([ 'one', 2, 'Three', 4 ])
//=> Last( Just "one" )

unfixFirstString([ 'one', 2, 'Three', 4 ])
  .concat(Last('another string'))
//=> Last( Just "another string" )

unfixFirstString([ 1, 2, 3, 4 ])
  .concat(Last('Last String'))
//=> Last( Just "Last String" )
```

#### maybeToLast

`crocks/Last/maybeToLast`

```haskell
maybeToLast :: Maybe a -> Last a
maybeToLast :: (a -> Maybe b) -> a -> Last b
```

Used to transform a given [`Maybe`][maybe] instance to a `Last` instance, `maybeToLast`
will turn a [`Just`][just] into a non-empty `Last` instance, wrapping the original value
contained within the `Last`. All [`Nothing`][nothing] instances will map to
an [`empty`](#empty) `Last` instance.

This function is available mostly for completion sake, as `Last` can always
take a [`Maybe`][maybe] as its argument during construction. So while there is not a
real need for this to be used for transforming instances, it can come in
handy for lifting [`Maybe`][maybe] returning functions.

Like all `crocks` transformation functions, `maybeToLast` has two possible
signatures and will behave differently when passed either a [`Maybe`][maybe] instance
or a function that returns an instance of [`Maybe`][maybe]. When passed the instance,
a transformed `Last` is returned. When passed a [`Maybe`][maybe] returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
import Last from 'crocks/Last'
import Maybe from 'crocks/Maybe'
import maybeToLast from 'crocks/Last/maybeToLast'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

const { Nothing, Just } = Maybe

// numVal :: a -> Maybe Number
const numVal = compose(
  chain(safe(isNumber)),
  prop('val')
)

// lastNumVal :: a -> Last Number
const lastNumVal =
  maybeToLast(numVal)

maybeToLast(Just(99))
//=> Last( Just 99 )

maybeToLast(Nothing())
//=> Last( Nothing )

Last(Just(99))
//=> Last( Just 99 )

Last(Nothing())
//=> Last( Nothing )

Last(Just(80))
  .concat(lastNumVal({ val: 97 }))
//=> Last( Just 97 )

lastNumVal({ val: 97 })
  .concat(Last(80))
//=> Last( Just 80 )

lastNumVal(null)
  .concat(Last(80))
//=> Last( Just 80 )
```

#### resultToLast

`crocks/Last/resultToLast`

```haskell
resultToLast :: Result e a -> Last a
resultToLast :: (a -> Result e b) -> a -> Last b
```

Used to transform a given `Result` instance to a `Last` instance,
`resultToLast` will turn an `Ok` instance into a non-empty `Last`,
wrapping the original value contained in the `Ok`. All `Err` instances will map
to an [`empty`](#empty) `Last`, mapping the originally contained value to
a `Unit`. Values on the `Err` will be lost and as such this transformation is
considered lossy in that regard.

Like all `crocks` transformation functions, `resultToLast` has two possible
signatures and will behave differently when passed either an `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `Last` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
import Last from 'crocks/Last'
import Result from 'crocks/Result'
import resultToLast from 'crocks/Last/resultToLast'

import isNumber from 'crocks/predicates/isNumber'
import tryCatch from 'crocks/Result/tryCatch'

const { Err, Ok } = Result

function onlyNums(x) {
  if(!isNumber(x)) {
    throw new Error('something amiss')
  }
  return x
}

// lastNum :: a -> Last Number
const lastNum =
  resultToLast(tryCatch(onlyNums))

// "this is bad" is lost, mapped to Nothing
resultToLast(Err('this is bad'))
//=> Last( Nothing )

resultToLast(Ok('this is great'))
//=> Last( Just "this is great" )

lastNum(90)
  .concat(Last(0))
//=> Last( Just 0 )

lastNum(null)
  .concat(Last(0))
//=> Last( Just 0 )
```

</article>

[just]: ../crocks/Maybe.html#just
[maybe]: ../crocks/Maybe.html
[nothing]: ../crocks/Maybe.html#nothing
[option]: ../crocks/Maybe.html#option
[first]: ./First.html
[either]: ../crocks/Either.html
[left]: ../crocks/Either.html#left
[right]: ../crocks/Either.html#right
