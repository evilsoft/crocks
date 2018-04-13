# Max

```haskell
Max Number
```

`Max` is a `Monoid` that will combines (2) `Number`s, resulting in the largest
of the two.

```javascript
import Max from 'crocks/Max'
import mconcat from 'crocks/helpers/mconcat'

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
import Max from 'crocks/Max'

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
import Max from 'crocks/Max'

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

#### equals

```haskell
Max a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Max` instances for equality by value, equals takes any given argument and returns `true` if the passed argument is a `Max` with an underlying value equal to the underlying value of the `Max` the method is being called on. If the passed argument is not a `Max` or the underlying values are not equal, equals will return `false`.

```javascript
import Max from 'crocks/Max'

Max(5)
  .equals(Max(5))
//=> true

Max(25)
  .equals(Max(31))
//=> false
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
import Max from 'crocks/Max'

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
