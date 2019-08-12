<header>

# Min

</header>

```haskell
Min Number
```

`Min` is a `Monoid` that will combines (2) `Number`s, resulting in the smallest
of the two.

```javascript
import Min from 'crocks/Min'
import mconcat from 'crocks/helpers/mconcat'

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

<article id="topic-implements">

## Implements

`Setoid`, `Semigroup`, `Monoid`

</article>

<article id="topic-construction">

## Construction

```haskell
Min :: Number -> Min Number
```

`Min` is a `Monoid` fixed to the type of `Number` and as such requires
a `Number` instance to be passed to the constructor. A new `Min` instance is
returned, wrapping the provided `Number`.

The values `undefined`, `null` and `NaN` will map to the `empty` (`Infinity`)
instead of throwing a `TypeError`.

```javascript
import Min from 'crocks/Min'

import equals from 'crocks/pointfree/equals'

Min(42)
//=> Min 42

Min(-Infinity)
//=> Min -Infinity

Min(undefined)
//=> Min Infinity

equals(Min(NaN), Min.empty())
//=> true
```

</article>

<article id="topic-constructor">

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
import Min from 'crocks/Min'

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

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Min a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Min` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed
argument is a `Min` with an underlying value equal to the underlying value of
the `Min` the method is being called on. If the passed argument is not
a `Min` or the underlying values are not equal, `equals` will return `false`.

```javascript
import Min from 'crocks/Min'

Min(5)
  .equals(Min(5))
//=> true

Min(25)
  .equals(Min(31))
//=> false
```

#### concat

```haskell
Min ~> Min -> Min
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Min`, it will result
in the smallest of the (2) `Number`s.

```javascript
import Min from 'crocks/Min'

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
extraction is available, types that implement `valueOf` are not necessarily
a `Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on a `Min` instance
will result in the underlying `Number`.

```javascript
import Min from 'crocks/Min'

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

</article>
