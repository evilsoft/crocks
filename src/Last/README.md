# Last

```haskell
Last a = Last (Maybe a)
```

`Last` is a `Monoid` that will always return the last, non-empty value when
(2) `Last` instances are combined. `Last` is able to be a `Monoid` because
it implements a `Maybe` under the hood. The use of the `Maybe` allows for an
[`empty`](#empty) `Last` to be represented with a `Nothing`.

`Last` can be constructed with either a value or a `Maybe` instance. Any value
passed to the constructor will be wrapped in a `Just` to represent a non-empty
instance of `Last`. Any `Maybe` passed to the constructor will be lifted as
is, allowing the ability to "choose" a value based on some disjunction.

While most `Monoid`s only provide a [`valueOf`](#valueof) function used for
extraction, `Last` takes advantage of its underlying `Maybe` to provide an
additional [`option`](#option) method. Using [`valueOf`](#valueof) will extract
the underlying `Maybe`, while [`option`](#option) will extract the underlying
value in the `Maybe`, using the provided default value when the underlying
`Maybe` is a `Nothing` instance.

```javascript
const Last = require('crocks/Last')

const and = require('crocks/logic/and')
const isNumber = require('crocks/predicates/isNumber')
const mconcatMap = require('crocks/helpers/mconcatMap')
const safe = require('crocks/Maybe/safe')

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

## Implements

`Semigroup`, `Monoid`

## Constructor Methods

#### empty

```haskell
Last.empty :: () -> Last a
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Last` the result of `empty` is `Nothing`. `empty` is available
on both the Constructor and the Instance for convenience.

```javascript
const Last = require('crocks/Last')
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

## Instance Methods

#### concat

```haskell
Last a ~> Last a -> Last a
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `Last`, it will always provide the
last non-empty value. All previous non-empty values will be thrown away and
will always result in the last non-empty value.

```javascript
const Last = require('crocks/Last')
const concat = require('crocks/pointfree/concat')

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

`Last` wraps an underlying `Maybe` which provides the ability to option out
a value in the case of an [`empty`](#empty) instance. Just like `option` on
a `Maybe` instance, it takes a value as its argument. When run on
an [`empty`](#empty) instance, the provided default will be returned.
If `option` is run on a non-empty instance however, the wrapped value will be
extracted not only from the `Last` but also from the underlying `Just`.

If the underlying `Maybe` is desired, the [`valueOf`](#valueof) method can be
used and will return the `Maybe` instead.

```javascript
const Last = require('crocks/Last')

const compose = require('crocks/helpers/compose')
const chain = require('crocks/pointfree/chain')
const isString = require('crocks/predicates/isString')
const mconcatMap = require('crocks/helpers/mconcatMap')
const prop = require('crocks/Maybe/prop')
const safe = require('crocks/Maybe/safe')

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
will result in the underlying `Maybe`.

```javascript
const Last = require('crocks/Last')

const { Nothing } = require('crocks/Maybe')
const valueOf = require('crocks/pointfree/valueOf')

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

## Transformation Functions

#### eitherToLast

`crocks/Last/eitherToLast`

```haskell
eitherToLast :: Either b a -> Last a
eitherToLast :: (a -> Either c b) -> a -> Last b
```

Used to transform a given `Either` instance to a `Last`
instance, `eitherToLast` will turn a `Right` instance into a non-empty `Last`,
wrapping the original value contained in the `Right`. All `Left` instances will
map to an [`empty`](#empty) `Last`, mapping the originally contained value to
a `Unit`. Values on the `Left` will be lost and as such this transformation is
considered lossy in that regard.

Like all `crocks` transformation functions, `eitherToLast` has (2) possible
signatures and will behave differently when passed either an `Either` instance
or a function that returns an instance of `Either`. When passed the instance,
a transformed `Last` is returned. When passed an `Either` returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
const Last = require('crocks/Last')
const { Left, Right } = require('crocks/Either')
const eitherToLast = require('crocks/Last/eitherToLast')

const concat = require('crocks/pointfree/concat')
const constant = require('crocks/combinators/constant')
const flip = require('crocks/combinators/flip')
const ifElse = require('crocks/logic/ifElse')
const isNumber = require('crocks/predicates/isNumber')
const mapReduce = require('crocks/helpers/mapReduce')

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

Used to transform a given `First` instance to a `Last` instance, `firstToLast`
will turn a non-empty instance into a non-empty `Last` wrapping the original
value contained within the `First`. All [`empty`](#empty) instances will map
to an [`empty`](#empty) `Last`.

Like all `crocks` transformation functions, `firstToLast` has (2) possible
signatures and will behave differently when passed either a `First` instance
or a function that returns an instance of `First`. When passed the instance,
a transformed `Last` is returned. When passed a `First` returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
const Last  = require('crocks/Last')
const First = require('crocks/First')
const firstToLast = require('crocks/Last/firstToLast')

const isString = require('crocks/predicates/isString')
const mconcatMap = require('crocks/helpers/mconcatMap')
const safe = require('crocks/Maybe/safe')

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

Used to transform a given `Maybe` instance to a `Last` instance, `maybeToLast`
will turn a `Just` into a non-empty `Last` instance, wrapping the original value
contained within the `Last`. All `Nothing` instances will map to
an [`empty`](#empty) `Last` instance.

This function is available mostly for completion sake, as `Last` can always
take a `Maybe` as its argument during construction. So while there is not a
real need for this to be used for transforming instances, it can come in
handy for lifting `Maybe` returning functions.

Like all `crocks` transformation functions, `maybeToLast` has (2) possible
signatures and will behave differently when passed either a `Maybe` instance
or a function that returns an instance of `Maybe`. When passed the instance,
a transformed `Last` is returned. When passed a `Maybe` returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
const Last = require('crocks/Last')
const { Nothing, Just } = require('crocks/Maybe')
const maybeToLast = require('crocks/Last/maybeToLast')

const chain = require('crocks/pointfree/chain')
const compose = require('crocks/helpers/compose')
const isNumber = require('crocks/predicates/isNumber')
const prop = require('crocks/Maybe/prop')
const safe = require('crocks/Maybe/safe')

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

Like all `crocks` transformation functions, `resultToLast` has (2) possible
signatures and will behave differently when passed either an `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `Last` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns a `Last`.

```javascript
const Last = require('crocks/Last')
const { Err, Ok } = require('crocks/Result')
const resultToLast = require('crocks/Last/resultToLast')

const isNumber = require('crocks/predicates/isNumber')
const tryCatch = require('crocks/Result/tryCatch')

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
