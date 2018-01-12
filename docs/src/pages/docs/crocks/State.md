---
title: "State"
description: "State Crock"
layout: "guide"
weight: 140
---

```haskell
State s a
```

`State` is an Algebraic Data Type that abstracts away the associated state
management that comes with stateful computations.`State` is parameterized by
two types, a state `s` and a resultant `a`. The resultant portion may vary it's
type, but the state portion must be fixed to a type that is used by all related
stateful computations.

All `State` instances wrap a function of the form `s -> Pair a s` and can be
constructed by providing a function of this form. In order to get maximum
reuse of existing functions, a few construction helpers are available on the
`State` constructor.

`State` is lazy and is required to be run at the edge with some initial state.
Three methods are available on the instance for running the `State` with a
given initial state. [`runWith`](#runwith) will return a `Pair a s` with the
state `s` on the right and the resultant `a` on the left.

The other two are used for extracting either the state or resultant, unwrapping
the values from the `Pair` and discarding the unwanted portion.
[`evalWith`](#evalwith) used when the resultant is wanted, while
[`execWith`](#execwith) is used to pull the state.

```javascript
const State = require('crocks/State')
const { get, put } = State

const Pair = require('crocks/Pair')
const constant = require('crocks/combinators/constant')


// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// putResultant :: String -> State String String
const putResultant = x =>
  put(x)
    .map(constant(x))

// standard construction
// State String String
State(s => Pair(toUpper(s), s))
  .runWith('nice')
//=> Pair('NICE', 'nice')

// construction helper
// State String String
get(toUpper)
  .runWith('nice')
//=> Pair('NICE', 'nice')

// combine states
get(toUpper)
  .chain(putResultant)
  .runWith('nice')
//=> Pair('NICE', 'NICE')

// pull resultant only
get(toUpper)
  .evalWith('nice')
//=> 'NICE'

// pull state only
get(toUpper)
  .execWith('nice')
//=> 'nice'
```

<article id="topic-implements">

## Implements
`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-constructor">

## Constructor Methods

#### get

```haskell
State.get :: () -> State s s
State.get :: (s -> a) -> State s a
```

A construction helper that is used to access the state portion of a given
`State` instance. To make the state accessible, `get` will place the state in
the resultant portion, overwriting what was there previously.

`get` may be called with or without a function as it's argument. When nothing is
provided for the argument, the state will be applied to the resultant as is. The
state will be mapped over any provided function that takes the same type as the
state, with the result deposited in the resultant.

```javascript
const { get } = require('crocks/State')

const chain = require('crocks/pointfree/chain')
const compose = require('crocks/helpers/compose')
const isNumber = require('crocks/predicates/isNumber')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')
const safe = require('crocks/Maybe/safe')

// propOr :: (String, (b -> Boolean), a) -> Object -> c
const propOr = (key, pred, def) =>
  compose(option(def), chain(safe(pred)), prop(key))

// safeNumber :: Object -> Number
const safeNumber =
  propOr('number', isNumber, 0)

get(safeNumber)
  .runWith({ number: 23 })
//=> Pair(23, { number: 23 })

get(safeNumber)
  .evalWith({ number: '23' })
//=> 0

get()
  .map(safeNumber)
  .evalWith({ number: 23 })
//=> 23

get()
  .map(safeNumber)
  .runWith({ string: '47' })
//=> Pair(0, { string: '47'})
```

#### modify

```haskell
State.modify :: (s -> s) -> State s ()
```

A construction helper that can be used to lift an endo-function that matches
the fixed type of the state portion. The lifted function will receive the state
and returns a new `State` instance with the result of the function in the state
portion. Great care should be taken to not use functions that will change the
type of the state as it may not be expected in other stateful computations and
can result in hard to track down bugs.

```javascript
const { modify } = require('crocks/State')

const mapProps = require('crocks/helpers/mapProps')

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// addState :: Number -> State Number ()
const addState = x =>
  modify(add(x))

// addValue :: Number -> State Object ()
const addValue = x =>
  modify(mapProps({ value: add(x) }))

addState(5)
  .execWith(45)
//=> 50

addValue(5)
  .execWith({ value: 45 })
//=> { value: 50 }

addValue(5)
  .execWith({})
//=> {}
```

#### put

```haskell
State.put :: s -> State s ()
```

Used to replace the state portion of a given State instance,, `put` can be
employed anytime that the state can change without having to know about it's
previous value. If the previous value is required for a given stateful
computation, [`modify`](#modify) can be used to lift a function that represents
the change.

As put updates the state, it is important to ensure that the state portion stays
fixed for all related functions. Changing the type of the state portion may
result in hard to debug bugs and destroys the relationship between stateful
computations.

```javascript
const { put } = require('crocks/State')

const compose = require('crocks/helpers/compose')
const isString = require('crocks/predicates/isString')
const option = require('crocks/pointfree/option')
const safe = require('crocks/Maybe/safe')

// safeString :: a -> String
const safeString =
  compose(option(''), safe(isString))

// reset :: () -> State String ()
const reset = () =>
  put('')

// update :: a ->  State String ()
const update =
  compose(put, safeString)

// heckYeah :: State String ()
const heckYeah =
  update('Oh Heck Yeah')

heckYeah
  .execWith('Gosh')
//=> 'Oh Heck Yeah'

heckYeah
  .chain(reset)
  .runWith('Gosh')
// Pair((), '')
```

#### of

```haskell
State.of :: a -> State s a
```

Used to "blindly" lift any Javascript value into a `State`, `of` will take the
provided value and return back a new `State` instance with the value in
the resultant. There are many uses for `of`, but mostly it is used to set the
resultant in the same way [`put`](#put) is used to replace the state. Many times
`of` is used at the start of a given stateful computation or in conjunction
with [`put`](#put) and [`modify`](#modify) to replace the `Unit` the resultant
is set to for those construction helpers.

```javascript
const State = require('crocks/State')
const { get, put } = State

// updatePop :: String -> State String String
const updatePop = x =>
  get().chain(
    old => put(x).chain(
      () => State.of(old)
    )
  )

State.of('hotness')
  .chain(updatePop)
  .runWith('crusty')
//=> Pair('crusty', 'hotness')
```

#### type

```haskell
State.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be
useful to the end user for debugging and building out custom types based on the
standard `crocks` types. While type comparisons can easily be done manually by
calling `type` on a given type, using the `isSameType` function hides much of
the boilerplate. `type` is available on both the Constructor and the Instance
for convenience.

```javascript
const State = require('crocks/State')

const Reader = require('crocks/Reader')
const identity = require('crocks/combinators/identity')
const isSameType = require('crocks/predicates/isSameType')

State.type() //=>  "State"

isSameType(State, State.of(3))        //=> true
isSameType(State, State)              //=> true
isSameType(State, Reader(identity))   //=> false
isSameType(State.of(false), Reader)   //=> false
```

</article>

<article id="topic-instance">

## Instance Methods

#### map

```haskell
State s a ~> (a -> b) -> State s b
```

While the state portion `s` of `State` must remain fixed to a type, the
resultant `a` can vary in it's type as needed. This allows complex stateful
computations to be represented with `State`. The `map` method provides a means
to lift a function into the datatype that will be applied to the resultant and
return a new instance of `State` with the result of the function as the new
resultant.

While this is similar to the [`modify`](#modify) construction helper, which
lifts an endo-function that acts upon the state, `map` does not require an
endo-function as it can move to any type.

Due to the composition law associated with `map`, successive `map`s can be
composed together using function composition. This will give the same results
but will only map the value once, instead of once for every mapping.

```javascript
const { get } = require('crocks/State')

const compose = require('crocks/helpers/compose')
const objOf = require('crocks/helpers/objOf')
const propOr = require('crocks/helpers/propOr')

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// getNum :: State Object Number
const getNum =
  get(propOr(0, 'num'))

getNum
  .map(add(10))
  .evalWith({ num: 32 })
//=> 42

getNum
  .map(add(10))
  .map(objOf('result'))
  .evalWith({ val: 32 })
//=> { result: 10 }

// comp :: Number -> Object
const comp = compose(
  objOf('result'),
  add(10)
)

getNum
  .map(comp)
  .evalWith({ num: 32 })
//=> { result: 42 }
```

#### ap

```haskell
State s (a -> b) ~> State s a -> State s b
```

Short for apply, the `ap` method is used to apply the resultant of a given
`State` instance to a function wrapped in another instance. On a `State`
instance that wraps a function, calling `ap`, providing it another `State`
instance, will return a new `State` instance with the result of the function
in the resultant portion.

When used with curried, polyadic functions, multiple stateful computations can
be combined using the lifted function as a means to combine each of the
instances' resultants.

```javascript
const { get, modify } = require('crocks/State')

const assoc = require('crocks/helpers/assoc')
const propOr = require('crocks/helpers/propOr')

const data = {
  tax: .084,
  sub: 34.97
}

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// multiply :: Number -> Number -> Number
const multiply =
  x => y => x * y

// round :: Number -> Number
const round =
  x => Math.round(x * 100) / 100

// getKey :: String -> State Object Number
const getKey = key =>
  get(propOr(0, key))

// updateKey :: String -> a -> State Object ()
const updateKey = key => val =>
  modify(assoc(key, val))

// addToSub :: Number -> String Object Number
const addToSub = x =>
  getKey('sub')
    .map(add(x))

const calcTax =
  getKey('tax')
    .map(multiply)
    .ap(getKey('sub'))

// applyTax :: State Object ()
const applyTax =
  calcTax
    .chain(addToSub)
    .map(round)
    .chain(updateKey('total'))

applyTax
  .execWith(data)
//=> { tax: 0.084, sub: 34.07, total: 37.91 }
```

#### chain

```haskell
State s a ~> (a -> State s b) -> State s b
```

As a means to combine stateful computations, `chain` is used to sequence
state transactions that either read from or write to the state. `chain` takes
a unary function that must return a new `State` instance. `chain` returns a new
`State` instance that will apply the computation when run.

```javascript
const { get, modify } = require('crocks/State')

// add :: Number -> State Number ()
const add = x =>
  modify(y => x + y)

// multiply :: Number -> State Number ()
const multiply = x =>
  modify(y => x * y)

// double :: () -> State Number ()
const double = () =>
  get()
    .chain(add)

// square :: () -> State Number ()
const square = () =>
  get()
    .chain(multiply)

add(10)
  .execWith(10)
//=> 20

add(10)
  .chain(double)
  .execWith(10)
//=> 40

add(10)
  .chain(square)
  .execWith(10)
//=> 400

add(10)
  .chain(double)
  .chain(square)
  .execWith(10)
//=> 1600
```

#### runWith

```haskell
State s a ~> s -> Pair a s
```

`State` is a lazy datatype that requires a value for it's state portion to be
run. A given `State` instance provides a `runWith` method that accepts a value
to run the instance with. The value must be a member of the type that the
given `State` instance is fixed to in it's state portion, `s`.

When called, `runWith` will run the state transition with the given value as the
initial state and will return the resulting `Pair` with the resultant in the
`fst` (first) and the state in the `snd` (second).


```javascript
const State = require('crocks/State')
const { get, put } = State

const K = require('crocks/combinators/constant')

// swap :: s -> s -> State s s
const swap = x => old =>
  put(x)
    .chain(K(State.of(old)))

//update :: s -> State s s
const update = x =>
  get()
    .chain(swap(x))

update(45)
  .runWith(100)
//=> Pair(100, 45)
```

#### evalWith

```haskell
State s a ~> s -> a
```

`State` is a lazy datatype that requires a value for it's state portion to
be run. A given `State` instance provides an `evalWith` method that accepts a
value to run the instance with. The value must be a member of the type that the
given `State` instance is fixed to in it's state portion, `s`.

When called, `evalWith` will run the state transition with the given value as
the initial state and will return the resulting resultant discarding the state
portion.

```javascript
const State = require('crocks/State')
const { get } = State

const concat = require('crocks/pointfree/concat')
const flip = require('crocks/combinators/flip')
const liftA2 = require('crocks/helpers/liftA2')
const map = require('crocks/pointfree/map')
const propOr = require('crocks/helpers/propOr')

const name = {
  first: 'Franklin',
  last: 'Jennings'
}

// getLast :: State Object String
const getFirst =
  get(propOr('', 'first'))

// getLast :: State Object String
const getLast =
  get(propOr('', 'last'))

// inner :: Functor f => f a -> f [ a ]
const inner =
  map(Array.of)

// combineNames :: State Object [ String ]
const combineNames = liftA2(
  flip(concat),
  inner(getFirst),
  inner(getLast)
)

combineNames
  .evalWith(name)
//=> [ 'Franklin', 'Jennings' ]
```

#### execWith

```haskell
State s a ~> s -> s
```

`State` is a lazy datatype that requires a value for it's state portion to
be run. A given `State` instance provides an `execWith` method that accepts a
value to run the instance with. The value must be a member of the type that the
given `State` instance is fixed to in it's state portion, `s`.

When called, `execWith` will run the state transition with the given value as
the initial state and will return the resulting state, discarding the resultant
portion.

```javascript
const { modify } = require('crocks/State')

const compose = require('crocks/helpers/compose')
const concat = require('crocks/pointfree/concat')

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// exclaim :: String -> String
const exclaim =
  concat('!!!')

// yell :: State String ()
const yell = modify(
  compose(exclaim, toUpper)
)

yell
  .execWith('nice')
//=> 'NICE!!!'
```

</article>

<article id="topic-pointfree">

## Pointfree Functions

#### evalWith *(pointfree)*

`crocks/State/evalWith`

```haskell
evalWith :: s -> State s a -> a
```

The `evalWith` pointfree function can be employed to execute the
[`evalWith`](#evalwith) method on a given `State` instance. This function is
typically used at the edge of a program where all the side-effects typically
reside.

As all this function does is return the result of applying a given initial state
to the [`evalWith`](#evalwith) method to the provided `State` instance, it will
also return the resulting resultant, throwing away the resulting state.


```javascript
const { get } = require('crocks/State')

const evalWith = require('crocks/State/evalWith')

const compose = require('crocks/helpers/compose')
const curry = require('crocks/helpers/curry')
const flip = require('crocks/combinators/flip')

// addToState :: Number -> State Number Number
const addToState =
  x => get(y => x + y)

// add :: Number -> Number -> Number
const add = curry(
  compose(flip(evalWith), addToState)
)

// add10 :: Number -> Number
const add10 =
  add(10)

add10(32)
//=> 42

add(1295, 42)
// 1337
```

#### execWith *(pointfree)*

`crocks/State/execWith`

```haskell
execWith :: s -> State s a -> s
```

The `execWith` pointfree function can be employed to execute the
[`execWith`](#execwith) method on a given `State` instance. This function is
typically used at the edge of a program where all the side-effects typically
reside.

As all this function does is return the result of applying a given initial state
to the [`execWith`](#execwith) method to the provided `State` instance, it will
also return the resulting state, throwing away the resulting resultant.

```javascript
const State = require('crocks/State')
const { modify } = State

const execWith = require('crocks/State/execWith')

const curry = require('crocks/helpers/curry')
const isSameType = require('crocks/predicates/isSameType')
const mapProps = require('crocks/helpers/mapProps')
const when = require('crocks/logic/when')

// middleware :: Object -> State Object | Object -> Object
const middleware = curry(
  s => when(isSameType(State), execWith(s))
)

// incValue :: State Object ()
const incValue =
  modify(mapProps({ value: x => x + 1 }))

middleware({ value: 10 }, incValue)
//=> { value: 11 }

middleware({ value: 10 }, { value: 32 })
//=> { value: 32 }
```

</article>
