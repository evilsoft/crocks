 # Arrow
```haskell
Arrow a b
```
`Arrow` is a `Profunctor` that lifts a function of type `a -> b` and allows for lazy execution of the function. `Arrow` can be considered a `Strong` `Profunctor` if the underlying data running throw the `Arrow` is a `Pair`, typically in the form of `Arrow (Pair a c) (Pair b d)`. This will allow you to split execution into two distinct paths, applying `Arrow` to a specific path. The parameters of `Arrow` represent the function that it wraps, with the input being on the left, and the output on the right. When an `Arrow` wraps an endomorphisim, the signature typically represents both parameters

```js
const Arrow = require('crocks/Arrow')
const chain = require('crocks/pointfree/chain')
const compose = require('crocks/helpers/compose')
const isString = require('crocks/predicates/isString')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')
const safe = require('crocks/Maybe/safe')

// arrUpper :: Arrow String
const arrUpper =
  Arrow(str => str.toUpperCase())

arrUpper
  .runWith('nice') //=> 'NICE'

// getName :: a -> String
const getName = compose(
  option('no name'),
  chain(safe(isString)),
  prop('name')
)

// arrUpperName :: Arrow a String
const arrUpperName =
  arrUpper
    .contramap(getName)

arrUpperName
  .runWith({ name: 'joey' }) //=> 'JOEY'

arrUpperName
  .runWith({ age: 23 }) //=> 'NO NAME'

arrUpperName
  .runWith({ name: false }) //=> 'NO NAME'

```

## Implements
`Semigroupoid`, `Category`, `Functor`, `Contravariant`, `Profunctor`

## Constructor Methods

### id
```haskell
Arrow.id :: () -> Arrow a
```

`id` provides the identity for the `Arrow` in that when it is composed to either the left or right side of a given function, it will essentially result in a morphisim that is, for all intents and purposes, the given function. For `Arrow`, `id` is the simple `identity` function that echos it's given argument (`x => x`). As a convenience, `id` is also available on the `Arrow` instance.
```js
// arrId :: Arrow a
const id = Arrow.id()

// arrow :: Arrow a String
const arrow =
  Arrow(x => x.toString())

// right :: Arrow a String
const left =
  id.compose(arrow)

// right :: Arrow a String
const right =
  arrow.compose(id)

right.runWith(12) //=> '12'
left.runWith(12)  //=> '12'
```


### type
```haskell
Arrow.type :: () -> String
```

`type` provides a string representation of the type name for a given type in `crocks`. While it is used mostly internally for law validation, it can be useful to the end user for debugging and building out custom types based on the standard `crocks` types. While type comparisons can easily be done manually by calling `type` on a given type, using the `isSameType` function hides much of the boilerplate. `type` is available on both the Constructor and the Instance for convenience.

```js
const Identity = require('crocks/Identity')
const K = require('crocks/helpers/identity')
const isSameType = require('crocks/predicates/isSameType')

Arrow.type() //=>  "Arrow"

isSameType(Arrow, Arrow(x => x + 3))  //=> true
isSameType(Arrow, Arrow)              //=> true
isSameType(Arrow, Idenity(0))         //=> false
isSameType(Arrow(K), Identity)        //=> false
```

## Instance Methods

### both
```haskell
Pair p => Arrow a b ~> () -> Arrow (p a a) (p b b)
```

`both` allows for the mode of a given `Arrow` to switch to a manner that applies itself to both slots of a `Pair` that is passed through the `Arrow`. As noted in the type signature, `both` will give back an `Arrow` has a new signature that utilizes a `Pair` on both sides.

```js
const merge = require('crocks/Pair/merge')

const double =
  Arrow(x => x * 2)

const doubleAndAdd =
  double
    .both()
    .map(merge((x, y) => x + y))
```
