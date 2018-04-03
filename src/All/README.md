 # All

```haskell
All Boolean
```
<details>
  <summary>Breakdown</summary>
  The Monoid <code> All </code> outputs type <code> Boolean </code>
</details>

`All` is a `Monoid` that will combine (2) values of any type using logical
conjunction (AND) on their coerced `Boolean` values, mapping truth-y values to
`true` and false-y values to `false`.

```javascript
import All from 'crocks/All'

import mconcat from 'crocks/helpers/mconcat'

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
<details>
  <summary>Breakdown</summary>
  The constructor <code> All.empty() </code> outputs type <code> All </code>
</details>

`empty` provides the identity for the `Monoid` in that when the value it
provides is `concat`ed to any other value, it will return the other value. In
the case of `All` the result of `empty` is `true`. `empty` is available on both
the Constructor and the Instance for convenience.

```javascript
import All from 'crocks/All'

All.empty() //=> All true

All(true).concat(All.empty())   //=> All true
All(false).concat(All.empty())  //=> All false
```

## Instance Methods

#### concat

```haskell
All ~> All -> All
```
<details>
  <summary>Breakdown</summary>
  <code> All.concat </code> inputs type <code> All </code> and outputs type <code> All </code>
</details>

`concat` is used to combine (2) `Semigroup`s of the same type under an operation
specified by the `Semigroup`. In the case of `All`, it will combine the (2)
using logical AND (conjunction).

```javascript
import All from 'crocks/All'

All(true).concat(All(true))   //=> All true
All(true).concat(All(false))  //=> All false
All(false).concat(All(true))  //=> All false
All(false).concat(All(false)) //=> All false
```

#### valueOf

```haskell
All ~> () -> Boolean
```
<details>
  <summary>Breakdown</summary>
  <code> All.valueOf() </code> outputs type <code> Boolean </code>
</details>

`valueOf` is used on all `crocks` `Monoid`s as a means of extraction. While the
extraction is available, types that implement `valueOf` are not necessarily a
`Comonad`. This function is used primarily for convenience for some of the
helper functions that ship with `crocks`. Calling `valueOf` on an `All` instance
will result in the underlying `Boolean` value.

```javascript
import All from 'crocks/All'

All(0).valueOf()          //=> false
All('string').valueOf() //=> true

//=> false
All(true)
  .concat('')
  .valueOf()
```
