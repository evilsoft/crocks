# Min

```haskell
Min Number
```

`Min` is a `Monoid` that will combines (2) `Number`s, resulting in the smallest
of the two.

```javascript
const Min = require('crocks/Min')
const mconcat = require('crocks/helpers/mconcat')

Min(76)
//=> Min 76

mconcat(Min, [ 95, 12, 56 ])
//=> Min 12

Min(100)
  .concat(Min(10))
//=> Min 10

Min.empty()
  .concat(Min(100))
//=> Min 100
```

## Implements

`Semigroup`, `Monoid`

## Constructor Methods

#### empty

```haskell
Min.empty :: () -> Min
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `Min` the result of `empty` is `Infinity`. `empty` is available on
both the Constructor and the Instance for convenience.

```javascript
const Min = require('crocks/Min')

Min.empty()
//=> Min Infinity

Min.empty()
  .concat(Min.empty())
//=> Min Infinity

Min(32)
  .concat(Min.empty())
//=> Min 32

Min.empty()
  .concat(Min(34))
//=> Min 34
```

## Instance Methods

#### concat

```haskell
Min ~> Min -> Min
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Min`, it will result
in the smallest of the (2) `Number`s.

```javascript
const Min = require('crocks/Min')

Min(50)
  .concat(Min(24))
//=> Min 24

Min(-120)
  .concat(Min(-50))
//=> Min -120

Min.empty()
  .concat(Min(-Infinity))
//=> Min -Infinity
```

#### valueOf

```haskell
Min ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Min` instance
will result in the underlying `Number`.

```javascript
const Min = require('crocks/Min')

Min(33)
  .valueOf()
//=> 33

Min.empty()
  .valueOf()
//=> Infinity

Min(35)
  .concat(Min(20))
  .valueOf()
//=> 20
```
