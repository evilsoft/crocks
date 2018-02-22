# First

```haskell
First a = First (Maybe a)
```

`First` is a `Monoid` that will always return the first, non-empty value when
(2) `First` instances are combined. `First` is able to be a `Monoid` because
it implements a `Maybe` under the hood. The use of the `Maybe` allows for an
[`empty`](#empty) `First` to be represented with a `Nothing`.

`First` can be constructed with either a value or a `Maybe` instance. Any value
passed to the constructor will be wrapped in a `Just` to represent a non-empty
instance of `First`. Any `Maybe` passed to the constructor will be lifted as
is, allowing the ability to "choose" a value based on some disjunction.

While most `Monoid`s only provide a [`valueOf`](#valueof) function used for
extraction, `First` takes advantage of its underlying `Maybe` to provide an
additional [`option`](#option) method. Using [`valueOf`](#valueof) will extract
the underlying `Maybe`, while [`option`](#option) will extract the underlying
value in the `Maybe`, using the provided default value when the underlying
`Maybe` is a `Nothing` instance.

```javascript
import First from 'crocks/First'

import and from 'crocks/logic/and'
import isNumber from 'crocks/predicates/isNumber'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

// isEven :: Number -> Boolean
const isEven =
  x => !(x % 2)

// isValid :: a -> Boolean
const isValid =
  and(isNumber, isEven)

// chooseFirst :: [ * ] -> First Number
const chooseFirst =
  mconcatMap(First, safe(isValid))

chooseFirst([ 21, 45, 2, 22, 19 ])
  .valueOf()
//=> Just 2

chooseFirst([ 'a', 'b', 'c' ])
  .option('')
//=> ""
```

## Implements

`Semigroup`, `Monoid`

## Constructor Methods

#### empty

```haskell
First.empty :: () -> First a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `First` the result of `empty` is `Nothing`. `empty` is available
on both the Constructor and the Instance for convenience.

```javascript
import First from 'crocks/First'
const { empty } = First

First.empty()
//=> First( Nothing )

First(3)
  .concat(empty())
//=> First( Just 3 )

empty()
  .concat(First(3))
//=> First( Just 3 )
```

## Instance Methods

#### concat

```haskell
First a ~> First a -> First a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `First`, it will always provide the
first non-empty value. Any subsequent non-empty values will be thrown away and
will always result in the first non-empty value.

```javascript
import First from 'crocks/First'
import concat from 'crocks/pointfree/concat'

const a = First('a')
const b = First('b')
const c = First('c')

a.concat(b)
//=> First( Just "a" )

b.concat(a)
//=> First( Just "b" )

concat(c, concat(b, a))
//=> First( Just "a" )

concat(concat(c, b), a)
//=> First( Just "a" )

concat(concat(a, b), c)
//=> First( Just "c" )
```

#### option

```haskell
First a ~> a -> a
```

`First` wraps an underlying `Maybe` which provides the ability to option out
a value in the case of an [`empty`](#empty) instance. Just like `option` on
a `Maybe` instance, it takes a value as its argument. When run on
an [`empty`](#empty) instance, the provided default will be returned.
If `option` is run on a non-empty instance however, the wrapped value will be
extracted not only from the `First` but also from the underlying `Just`.

If the underlying `Maybe` is desired, the [`valueOf`](#valueof) method can be
used and will return the `Maybe` instead.

```javascript
import First from 'crocks/First'

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

// firstValid :: [ a ] -> First String
const firstValid =
  mconcatMap(First, stringVal)

// good :: [ Object ]
const good =
  [ { val: 23 }, { val: 'string' }, { val: '23' } ]

// bad :: [ Object ]
const bad =
  [ { val: 23 }, { val: null }, {} ]

firstValid(good)
  .option('')
//=> "string"

firstValid(bad)
  .option('')
//=> ""
```

#### valueOf

```haskell
First a ~> () -> Maybe a
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on
a `First` instance will result in the underlying `Maybe`.

```javascript
import First from 'crocks/First'

import Maybe from 'crocks/Maybe'
const { Nothing } = Maybe
import valueOf from 'crocks/pointfree/valueOf'

valueOf(First(56))
//=> Just 56

valueOf(First.empty())
//=> Nothing

First(37)
  .concat(First(99))
  .valueOf()
//=> Just 37

First(Nothing())
  .concat(First.empty())
  .valueOf()
//=> Nothing
```

## Transformation Functions

#### eitherToFirst

`crocks/First/eitherToFirst`

```haskell
eitherToFirst :: Either b a -> First a
eitherToFirst :: (a -> Either c b) -> a -> First b
```

Used to transform a given `Either` instance to a `First`
instance, `eitherToFirst` will turn a `Right` instance into a non-empty `First`,
wrapping the original value contained in the `Right`. All `Left` instances will
map to an [`empty`](#empty) `First`, mapping the originally contained value to a `Unit`.
Values on the `Left` will be lost and as such this transformation is considered
lossy in that regard.

Like all `crocks` transformation functions, `eitherToFirst` has (2) possible
signatures and will behave differently when passed either an `Either` instance
or a function that returns an instance of `Either`. When passed the instance,
a transformed `First` is returned. When passed an `Either` returning function,
a function will be returned that takes a given value and returns a `First`.

```javascript
import First from 'crocks/First'
import Either from 'crocks/Either'
const { Left, Right } = Either
import eitherToFirst from 'crocks/First/eitherToFirst'

import concat from 'crocks/pointfree/concat'
import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import mapReduce from 'crocks/helpers/mapReduce'

// someNumber :: a -> Either String Number
const someNumber = ifElse(
  isNumber,
  Right,
  constant(Left('Nope'))
)

// firstNumber :: [ a ] -> First Number
const firstNumber = mapReduce(
  eitherToFirst(someNumber),
  flip(concat),
  First.empty()
)

// "Bad Times" is lost, mapped to Nothing
eitherToFirst(Left('Bad Times'))
//=> First( Nothing )

eitherToFirst(Right('correct'))
//=> First( Just "correct" )

firstNumber([ 'string', null, 34, 76 ])
//=> First( Just 34 )

firstNumber([ 'string', null, true ])
//=> First( Nothing )
```

#### lastToFirst

`crocks/First/lastToFirst`

```haskell
lastToFirst :: Last a -> First a
lastToFirst :: (a -> Last b) -> a -> First b
```

Used to transform a given `Last` instance to a `First` instance, `lastToFirst`
will turn a non-empty instance into a non-empty `First` wrapping the original
value contained within the `Last`. All [`empty`](#empty) instances will map
to an [`empty`](#empty) `First`.

Like all `crocks` transformation functions, `lastToFirst` has (2) possible
signatures and will behave differently when passed either a `Last` instance
or a function that returns an instance of `Last`. When passed the instance,
a transformed `First` is returned. When passed a `Last` returning function,
a function will be returned that takes a given value and returns a `First`.

```javascript
import First from 'crocks/First'
import Last  from 'crocks/Last'
import lastToFirst from 'crocks/First/lastToFirst'

import isString from 'crocks/predicates/isString'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

// lastString :: [ a ] -> Last String
const lastString =
  mconcatMap(Last, safe(isString))

// fixLastString :: [ a ] -> First String
const fixLastString =
  lastToFirst(lastString)

lastToFirst(Last.empty())
//=> First( Nothing )

lastToFirst(Last(false))
//=> First( Just false )

fixLastString([ 'one', 2, 'Three', 4 ])
  .concat(First('another string'))
//=> First( Just "Three" )

fixLastString([ 1, 2, 3, 4 ])
  .concat(First('First String'))
//=> First( Just "First String" )
```

#### maybeToFirst

`crocks/First/maybeToFirst`

```haskell
maybeToFirst :: Maybe a -> First a
maybeToFirst :: (a -> Maybe b) -> a -> First b
```

Used to transform a given `Maybe` instance to a `First`
instance, `maybeToFirst` will turn a `Just` into a non-empty `First` instance,
wrapping the original value contained within the `First`.
All `Nothing` instances will map to an [`empty`](#empty) `First` instance.

This function is available mostly for completion sake, as `First` can always
take a `Maybe` as its argument during construction. So while there is not a
real need for this to be used for transforming instances, it can come in
handy for lifting `Maybe` returning functions.

Like all `crocks` transformation functions, `maybeToFirst` has (2) possible
signatures and will behave differently when passed either a `Maybe` instance
or a function that returns an instance of `Maybe`. When passed the instance,
a transformed `First` is returned. When passed a `Maybe` returning function,
a function will be returned that takes a given value and returns a `First`.

```javascript
import First from 'crocks/First'
import Maybe from 'crocks/Maybe'
const { Nothing, Just } = Maybe
import maybeToFirst from 'crocks/First/maybeToFirst'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import isNumber from 'crocks/predicates/isNumber'
import prop from 'crocks/Maybe/prop'
import safe from 'crocks/Maybe/safe'

// numVal :: a -> Maybe Number
const numVal = compose(
  chain(safe(isNumber)),
  prop('val')
)

// firstNumVal :: a -> First Number
const firstNumVal =
  maybeToFirst(numVal)

maybeToFirst(Just(99))
//=> First( Just 99 )

maybeToFirst(Nothing())
//=> First( Nothing )

First(Just(99))
//=> First( Just 99 )

First(Nothing())
//=> First( Nothing )

firstNumVal({ val: 97 })
  .concat(First(80))
//=> First( Just 97 )

firstNumVal({ val: '97' })
  .concat(First(80))
//=> First( Just 80 )

firstNumVal(null)
  .concat(First(80))
//=> First( Just 80 )
```

#### resultToFirst

`crocks/First/resultToFirst`

```haskell
resultToFirst :: Result e a -> First a
resultToFirst :: (a -> Result e b) -> a -> First b
```

Used to transform a given `Result` instance to a `First` instance,
`resultToFirst` will turn an `Ok` instance into a non-empty `First`,
wrapping the original value contained in the `Ok`. All `Err` instances will map
to an [`empty`](#empty) `First`, mapping the originally contained value to
a `Unit`. Values on the `Err` will be lost and as such this transformation is
considered lossy in that regard.

Like all `crocks` transformation functions, `resultToFirst` has (2) possible
signatures and will behave differently when passed either an `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `First` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns a `First`.

```javascript
import First from 'crocks/First'
import Result from 'crocks/Result'
const { Err, Ok } = Result
import resultToFirst from 'crocks/First/resultToFirst'

import isNumber from 'crocks/predicates/isNumber'
import tryCatch from 'crocks/Result/tryCatch'

function onlyNums(x) {
  if(!isNumber(x)) {
    throw new Error('something amiss')
  }
  return x
}

// firstNum :: a -> First Number
const firstNum =
  resultToFirst(tryCatch(onlyNums))

// "this is bad" is lost, mapped to Nothing
resultToFirst(Err('this is bad'))
//=> First( Nothing )

resultToFirst(Ok('this is great'))
//=> First( Just "this is great" )

firstNum(90)
  .concat(First(0))
//=> First( Just 90 )

firstNum(null)
  .concat(First(0))
//=> First( Just 0 )
```
