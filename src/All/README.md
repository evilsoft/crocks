 # All

```haskell
All Boolean
```

`All` is a `Monoid` that will combine (2) values of any type using logical
conjunction (AND) on their coerced `Boolean` values, mapping truth-y values to
`true` and false-y values to `false`.

```javascript
const All = require('crocks/All')

const mconcat = require('crocks/helpers/mconcat')

const trueNum = All(13)
const falseNum = All(0)
const trueString = All('So true')

trueNum.concat(falseNum)
//=> All false

trueNum.concat(trueString)
//=> All true

const allGood =
  mconcat(All)

allGood([ 1, 5, 89 ])
//=> All true

allGood([ 'nice', '00', null ])
//=> All false
```

## Implements

`Semigroup`, `Monoid`

## Constructor Methods

#### empty

```haskell
All.empty :: () -> All
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `All` the result of `empty` is `true`. `empty` is available on both
the Constructor and the Instance for convenience.

```javascript
const All = require('crocks/All')

All.empty() //=> All true

All(true).concat(All.empty())   //=> All true
All(false).concat(All.empty())  //=> All false
```

#### type

```haskell
All.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on the
standard `crocks` types. While type comparisons can easily be done manually by
calling `type` on a given type, using the `isSameType` function hides much of
the boilerplate. `type` is available on both the Constructor and the Instance
for convenience.

```javascript
const All = require('crocks/All')

const Maybe = require('crocks/Maybe')
const isSameType = require('crocks/predicates/isSameType')

All.type() //=>  "All"

isSameType(All, All(3))           //=> true
isSameType(All, All)              //=> true
isSameType(All, Maybe.Just('3'))  //=> false
isSameType(All(false), Maybe)     //=> false
```

## Instance Methods

#### concat

```haskell
All ~> All -> All
```

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `All`, it will combine the (2)
using logical AND (conjunction).

```javascript
const All = require('crocks/All')

All(true).concat(All(true))   //=> All true
All(true).concat(All(false))  //=> All false
All(false).concat(All(true))  //=> All false
All(false).concat(All(false)) //=> All false
```

#### valueOf

```haskell
All ~> () -> Boolean
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on an `All` instance
will result in the underlying `Boolean` value.

```javascript
const All = require('crocks/All')

All(0).valueOf()          //=> false
All('string').valueOf() //=> true

//=> false
All(true)
  .concat('')
  .valueOf()
```
