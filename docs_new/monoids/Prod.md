<header>

# Prod

</header>

```haskell
Prod Number
```

`Prod` is a `Monoid` that will combine (2) `Number`s under multiplication.

```javascript
import Prod from 'crocks/Prod'
import compose from 'crocks/helpers/compose'
import concat from 'crocks/pointfree/concat'

const emptyProd = Prod.empty()
const tenProd = Prod(10)
const hundredProd = Prod(100)

emptyProd
  .concat(emptyProd)
//=> Prod 1

tenProd
  .concat(hundredProd)
//=> Prod 1000

// prodBy2 :: Number -> Prod
const double =
  compose(concat(Prod(2)), Prod)

double(4)
//=> Prod 8

double(11)
//=> Prod 22
```

<article id="topic-implements">

## Implements

`Setoid`, `Semigroup`, `Monoid`

</article>

<article id="topic-construction">

## Construction

```haskell
Prod :: Number -> Prod Number
```

`Prod` provides multiplication on `Number`s and needs to be constructed with
a `Number` instance. Calling the constructor with a `Number`, results in a
new `Prod` that wraps the provided `Number`.

Passing `undefined`, `NaN` or `null` to the constructor will result in
an `empty` instance, or an instance containing a `1`.

```javascript
import Prod from 'crocks/Prod'

import equals from 'crocks/pointfree/equals'

Prod(100)
//=> Prod 100

Prod(-Infinity)
//=> Prod -Infinity

Prod(undefined)
//=> Prod 1

equals(Prod(null), Prod.empty())
//=> true
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### empty

```haskell
Prod.empty :: () -> Prod
```

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to object other value, it will return the other value.
In the case of `Prod` the result of `empty` is `1`. `empty` is available on
both the Constructor and the Instance for convenience.

```javascript
import Prod from 'crocks/Prod'

Prod.empty()
//=> Prod 1

Prod.empty()
  .concat(Prod.empty())
//=> Prod 1

Prod(4)
  .concat(Prod.empty())
//=> Prod 4

Prod.empty()
  .concat(Prod(4))
//=> Prod 4
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Prod a ~> b -> Boolean
```

Used to compare the underlying values of (2) `Prod` instances for equality by
value, `equals` takes any given argument and returns `true` if the passed argument
is a `Prod` with an underlying value equal to the underlying value of
the `Prod` the method is being called on. If the passed argument is not
a `Prod` or the underlying values are not equal, `equals` will return `false`.

```javascript
import Prod from 'crocks/Prod'

Prod(5)
  .equals(Prod(5))
//=> true

Prod(25)
  .equals(Prod(31))
//=> false
```

#### concat

```haskell
Prod ~> Prod -> Prod
```

`concat` is used to combine (2) `Semigroup`s of the same type under an
operation specified by the `Semigroup`. In the case of `Prod`, `concat` will
multiply the (2) `Number`s.

```javascript
import Prod from 'crocks/Prod'

Prod(5)
  .concat(Prod(4))
//=> Prod 20

Prod(45)
  .concat(Prod(32))
//=> Prod 1440

Prod(1000)
  .concat(Prod(Infinity))
//=> Prod Infinity

Prod.empty()
  .concat(Prod(3))
//=> Prod 3
```

#### valueOf

```haskell
Prod ~> () -> Number
```

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While
the extraction is available, types that implement `valueOf` are not necessarily
a `Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on 
a `Prod` instance will result in the underlying `Number`.

```javascript
import Prod from 'crocks/Prod'

Prod.empty()
  .valueOf()
//=> 1

Prod(4)
  .valueOf()
//=> 4

Prod(34)
  .concat(Prod(21))
  .valueOf()
//=> 714
```

</article>
