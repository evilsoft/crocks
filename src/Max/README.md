# Max

```haskell
Max Number
```

`Max` is a `Monoid` that will combines (2) `Number`s, resulting in the largest
of the two.

```javascript
const Max = require('crocks/Max')
const mconcat = require('crocks/helpers/mconcat')

Max(76)
//=> Max 76

mconcat(Max, [ 95, 102, 56 ])
//=> Max 102

Max(100)
  .concat(Max(10))
//=> Max 100

Max.empty()
  .concat(Max(100))
//=> Max 100
```

## Implements

`Semigroup`, `Monoid`

## Constructor Methods

#### empty

```haskell
Max.empty :: () -> Max
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Max` the result of `empty` is `-Infinity`. `empty` is available on
both the Constructor and the Instance for convenience.

```javascript
const Max = require('crocks/Max')

Max.empty()
//=> Max -Infinity

Max.empty()
  .concat(Max.empty())
//=> Max -Infinity

Max(32)
  .concat(Max.empty())
//=> Max 32

Max.empty()
  .concat(Max(34))
//=> Max 34
```

## Instance Methods

#### concat

```haskell
Max ~> Max -> Max
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Max`, it will result
in the largest of the (2) `Number`s.

```javascript
const Max = require('crocks/Max')

Max(23)
  .concat(Max(13))
//=> Max 23

Max(-23)
  .concat(Max(-32))
//=> Max -23

Max.empty()
  .concat(Max(Infinity))
//=> Max Infinity
```

#### valueOf

```haskell
Max ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Max` instance
will result in the underlying `Number`.

```javascript
const Max = require('crocks/Max')

Max(4)
  .valueOf()
//=> 4

Max.empty()
  .valueOf()
//=> -Infinity

Max(34)
  .concat(Max(21))
  .valueOf()
//=> 34
```
