 # Reader

```haskell
Reader e a
```

`Reader` is a lazy Product Type that enables the  composition of computations
that depend on a shared environment `(e -> a)`. The left portion, the `e` must
be fixed to a type for all related computations. The right portion `a` can vary
in its type.

As `Reader` is lazy, wrapping a function of the form `(e -> a)`, nothing is
executed until it is run with an environment. `Reader` provides a method on
it's instance that will take an environment called `runWith` that will run
the instance with a given environment.

Not only is `Reader`'s environment fixed to a type, but it should be immutable
for the "life" computation. If a referential type is used as the environment
great care should be taken to not modify the value of the environment.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const concat = require('crocks/pointfree/concat')

// greet :: String -> Reader String String
const greet = greeting =>
  Reader(name => `${greeting}, ${name}`)

// addFarewell :: String -> Reader String String
const addFarewell = farewell => str =>
  ask(env => `${str}${farewell} ${env}`)

// flow :: Reader String String
const flow =
  greet('Hola')
    .map(concat('...'))
    .chain(addFarewell('See Ya'))

flow
  .runWith('Thomas')
// => Hola, Thomas...See Ya Thomas

flow
  .runWith('Jenny')
// => Hola, Jenny...See Ya Jenny
```

## Implements

`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

## Constructor Methods

#### ask

```haskell
Reader.ask :: () -> Reader e e
Reader.ask :: (e -> b) -> Reader e b
```

A construction helper that returns a `Reader` with the environment on the right
portion of the `Reader`. `ask` can take a function, that can be used to map the
environment to a different type or value.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// Typical constructor
Reader(add(10))
  .runWith(56)
//=> 66

// Using `ask` with no function
// (identity on environment)
ask()
  .runWith(56)
//=> 56

// Using `ask` with a function
// (map environment before deposit)
ask(add(10))
  .runWith(56)
//=> 66
```

#### of

```haskell
Reader.of :: a -> Reader e a
```

`of` is used to construct a `Reader` with the right portion populated with it's
argument. `of` essentially will lift a value of type `a` into a `Reader`, giving
back a `Reader` that is "pointed" to the specific value provided. `of` makes
for a wonderful starting point for some of the more complicated flows.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const objOf = require('crocks/helpers/objOf')
const thrush = require('crocks/combinators/reverseApply')

// add :: Number -> Number -> Number
const add =
  x => y => x + y

Reader.of(34)
  .map(add(6))
  .runWith()
//=> 40

Reader.of('Bobby')
  .map(objOf('name'))
  .runWith()
//=> { name: 'Bobby' }

Reader.of(57)
  .chain(x => ask(add).map(thrush(x)))
  .runWith(43)
//=> 100
```

#### type

```haskell
Reader.type :: () -> String
```

`type` provides a string representation of the type name for a given type in
`crocks`. While it is used mostly internally for law validation, it can be useful
to the end user for debugging and building out custom types based on the standard
`crocks` types. While type comparisons can easily be done manually by calling
`type` on a given type, using the `isSameType` function hides much of the
boilerplate. `type` is available on both the Constructor and the Instance for
convenience.

```javascript
const Reader = require('crocks/Reader')
const Identity = require('crocks/Identity')

const I = require('crocks/combinators/identity')
const isSameType = require('crocks/predicates/isSameType')

Reader.type() //=> 'Reader'

isSameType(Reader, Reader.of(76))   //=> true
isSameType(Reader, Reader)          //=> true
isSameType(Reader, Identity(0))     //=> false
isSameType(Reader(I), Identity)     //=> false
```

## Instance Methods

#### map

```haskell
Reader e a ~> (a -> b) -> Reader e b
```

While the left side, or the environment, of the `Reader` must always be fixed
to the same type, the right side, or value, of the `Reader` may vary. Using `map`
allows a function to be lifted into the `Reader`, mapping the result into the
result of the lifted function.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const assign = require('crocks/helpers/assign')
const B = require('crocks/combinators/composeB')
const objOf = require('crocks/helpers/objOf')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')

// length :: Array -> Number
const length =
  x => x.length

ask()
  .map(length)
  .runWith([ 1, 2, 3 ])
//=> 3

// propOr :: (String, a) -> b -> a
const propOr = (key, def) =>
  B(option(def), prop(key))

// lengthObj :: Array -> Object
const lengthObj =
  B(objOf('length'), length)

// addLength :: Object -> Redaer Array Object
const addLength = x =>
  ask(propOr('list', []))
    .map(B(assign(x), lengthObj))

Reader.of({ num: 27 })
  .chain(addLength)
  .runWith({ list: [ 1, 2, 3 ] })
//=> { length: 3, num: 27 }
```

#### ap

```haskell
Reader e (a -> b) ~> Reader e a -> Reader e b
```

`ap` allows for values wrapped in a `Reader` to be applied to functions also
wrapped in a `Reader`. In order to use `ap`, the `Reader` must contain a
function as its value. Under the hood, `ap` unwraps both the function
and the value to be applied and applies the value to the function. Finally it
will wrap the result of that application back into a `Reader`. It is required
that the inner function is curried.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const B = require('crocks/combinators/composeB')
const assign = require('crocks/helpers/assign')
const liftA2 = require('crocks/helpers/liftA2')
const objOf = require('crocks/helpers/objOf')

// namePart :: Number -> String -> String
const namePart = indx => x =>
  x.split(' ')[indx] || ''

// combine :: Object -> Reader Object
const combine =
  x => ask(assign(x))

// full :: Reader Object
const full =
  ask(({ full }) => full)

// first :: Reader Object
const first =
  full
    .map(B(objOf('first'), namePart(0)))

// last :: Reader Object
const last =
  full
    .map(B(objOf('last'), namePart(1)))

// fluent style
Reader.of(assign)
  .ap(first)
  .ap(last)
  .chain(combine)
  .runWith({ full: 'Mary Jones' })
//=> { full: 'Mary Jones', first: 'Mary', last: 'Jones' }

// liftAssign :: Reader Object -> Reader Object -> Reader Object
const liftAssign =
  liftA2(assign)

// using a lift function
liftAssign(first, last)
  .chain(combine)
  .runWith({ full: 'Tom Jennings' })
//=> { full: 'Tom Jennings', first: 'Tom', last: 'Jennings' }
```

#### chain

```haskell
Reader e a ~> (a -> Reader e b) -> Reader e b
```

One of the ways `Monad`s like `Reader` are able to be combined and have their
effects applied, is by using the `chain` method. In the case of `Reader`, the
effect is to read in and make available the shared environment. `chain` expects
a function that will take any `a` and return a new `Reader` with a value of `b`.

```javascript
const Reader = require('crocks/Reader')
const { ask } = Reader

const B = require('crocks/combinators/composeB')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')

// multiply :: Number -> Number -> Number
const multiply =
  x => y => x * y

// add :: Number -> Number -> Number
const add  =
  x => y => x + y

// propOr :: (String, a) -> b -> a
const propOr = (key, def) =>
  B(option(def), prop(key))

// applyScale :: Number -> Reader Object Number
const applyScale = x =>
  ask(propOr('scale', 1))
    .map(multiply(x))

// applyScale :: Number -> Reader Object Number
const applyOffset = x =>
  ask(propOr('offset', 0))
    .map(add(x))

// applyTransforms :: Number -> Reader Object Number
const applyTransform = x =>
  Reader.of(x)
    .chain(applyOffset)
    .chain(applyScale)

applyTransform(45)
  .runWith({})
//=> 45

applyTransform(45)
  .runWith({ offset: 20 })
//=> 65

applyTransform(45)
  .runWith({ scale: 2 })
//=> 90

applyTransform(45)
  .runWith({ scale: 2, offset: 20 })
//=> 130
```

#### runWith

```haskell
Reader e a ~> e -> a
```

As `Reader` is a lazy datatype that requires a shared environment to run, it's
instance provides a `runWith` method that takes in an environment and returns
the result of the computation.

```javascript
const { ask } = require('crocks/Reader')
const Pair = require('crocks/Pair')

const fst = require('crocks/Pair/fst')
const liftA2 = require('crocks/helpers/liftA2')
const snd = require('crocks/Pair/snd')

// data :: Pair Number Number
const data =
  Pair(20, 45)

// getCorrect :: Reader (Pair Number Number) Number
const getCorrect =
  ask(fst)

// getTotal :: Reader (Pair Number Number) Number
const getTotal =
  ask(snd)

// divide :: Number -> Number -> Number
const divide =
  x => y => x / y

// formatPercent :: Number -> String
const formatPercent =
  x => `${Math.floor(x * 1000) / 10}%`

// calcPercent :: Reader (Pair Number Number) String
const calcPercent =
  liftA2(divide, getCorrect, getTotal)
    .map(formatPercent)

calcPercent
  .runWith(data)
//=. '44.4%'
```

Monad Transformer
---

## ReaderT

```haskell
Monad m => ReaderT e (m a)
```

`ReaderT` is a `Monad Transformer` that wraps a given `Monad` with a `Reader`.
This allows the interface of a `Reader` that enables the  composition of
computations that depend on a shared environment `(e -> a)`, but provides a way
to abstract a means the `Reader` portion, when combining `ReaderT`s of the same
type. All `ReaderT`s must provide the constructor of the target `Monad` that is
being wrapped.

### Constructor Methods

#### ask

```haskell
ReaderT.ask :: Monad m => () -> ReaderT e (m e)
ReaderT.ask :: Monad m => (e -> a) -> ReaderT e (m a)
```

A construction helper that returns a `ReaderT` with environment on the right
portion of the `Reader`. `ask` can take a function, that can be used to map the
environment to a different type or value. When using the function version, the
function must return the type of the `Monad` the `ReaderT` wraps, which in turn
will be wrapped in another

```javascript
const ReaderT = require('crocks/Reader/ReaderT')
const Maybe = require('crocks/Maybe')

const safe = require('crocks/Maybe/safe')
const isNumber = require('crocks/predicates/isNumber')

const MaybeReader = ReaderT(Maybe)
const { ask } = MaybeReader

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// Typical Constructor
MaybeReader(safe(isNumber))
  .runWith(76)
//=> Just 76

MaybeReader(safe(isNumber))
  .runWith('76')
//=> Nothing

// Using `ask` with no function
// (identity on environment)
ask()
  .runWith(76)
//=> Just 76

ask()
  .runWith('76')
//=> Just '76'

// Using `ask` with a function
// (map environment before deposit)
ask(add(10))
  .runWith(76)
//=> Just 86
```

#### lift

```haskell
ReaderT.lift :: Monad m => m a -> ReaderT e (m a)
```

Used to promote an instance of a given `Monad` into a `ReaderT` of that `Monad`s
type. This can be used to lift a pointed instance of the underlying `Monad`.
When mixed with composition, `lift` can be used to promote functions that take
the form of `a -> m b` into a function that can be `chain`ed with the `ReaderT`.
Although, [`liftFn`](#liftfn) can be used to remove the composition boilerplate
and promote and `a -> m b` function.

<!-- eslint-disable no-console -->
```javascript
const ReaderT = require('crocks/Reader/ReaderT')
const Async = require('crocks/Async')

const compose = require('crocks/helpers/compose')
const curry = require('crocks/helpers/curry')
const flip = require('crocks/combinators/flip')
const runWith = require('crocks/pointfree/runWith')
const tap = require('crocks/helpers/tap')

const AsyncReader = ReaderT(Async)

const { ask, lift } = AsyncReader
const { Rejected } = Async

// log :: String -> a -> ()
const log = label =>
  console.log.bind(console, label + ':')

// forkLog :: Async a b -> Async a b
const forkLog = tap(
  m => m.fork(log('rej'), log('res'))
)

// runAndLog :: e -> ReaderT e (Async a b) -> Async a b
const runAndLog = curry(
  x => compose(forkLog, flip(runWith, x))
)

// instance :: ReaderT e (Async String a)
const instance =
  lift(Rejected('Always Rejected'))

runAndLog(instance, 'Thomas')
//=> rej: Always Rejected

// Using in a composition
// rejectWith :: a -> ReaderT e (Async a b)
const rejectWith =
  compose(lift, Rejected)

// envReject :: ReadetT e (Async e b)
const envReject =
  ask()
    .chain(rejectWith)

runAndLog(envReject, 'Sammy')
//=> rej: Sammy
```

#### liftFn

```haskell
ReaderT.liftFn :: Monad m => (a -> m b) -> a -> ReaderT e (m b)
```

Used to transform a given function in the form of `a -> m b` into a lifted
function, where `m` is the underlying `Monad` of a `ReaderT`. This allows for
the removal of composition boilerplate that results from using the
[`lift`](#lift) helper.

```javascript
const ReaderT = require('crocks/Reader/ReaderT')
const Either = require('crocks/Either')

const ifElse = require('crocks/logic/ifElse')

const EitherReader = ReaderT(Either)

const { ask, liftFn } = EitherReader
const { Left, Right } = Either

// gte :: Number -> Number -> Either String Number
const gte = x => ifElse(
  n => n >= x,
  Right,
  n => Left(`${n} is not gte to ${x}`)
)

// gte10 :: Number -> Either String Number
const gte10 =
  gte(10)

// add20 :: ReaderT Number (Either String Number)
const add20 =
  ask()
    .chain(liftFn(gte10))
    .map(n => n + 20)

add20
  .runWith(30)
//=> Right 50

add20
  .runWith(9)
//=> Left "9 is not gte to 10"
```

#### of

```haskell
ReaderT.of :: Monad m => a -> ReaderT e (m a)
```

Lifts a value into a `ReaderT` using the `of` method of the underlying `Monad`.
`of` will disregard the environment and points the right portion to the provided
value.

```javascript
const ReaderT = require('../crocks/src/Reader/ReaderT')

const Maybe = require('crocks/Maybe')
const Either = require('crocks/Either')
const State = require('crocks/State')

const MaybeReader = ReaderT(Maybe)
const EitherReader = ReaderT(Either)
const StateReader = ReaderT(State)

MaybeReader.of('yep')
  .map(x => x.toUpperCase())
  .runWith(23)
//=> Just "YEP"

EitherReader.of(43)
  .runWith(23)
//=> Right 43

StateReader.of(0)
  .runWith(23)
  .runWith(42)
//=> Pair(0, 42)
```

### Instance Methods

#### map

```haskell
Monad m => ReaderT e (m a) ~> (a -> b) -> ReaderT e (m b)
```

Provides a means for lifting a normal javascript function into the underlying
`Monad`, allowing the innermost value of the underlying `Monad` to be mapped.
This method will ignore the outer `ReaderT`, and be applied directly to the
underlying `Monad`.

```javascript
const ReaderT = require('crocks/Reader/ReaderT')
const Maybe = require('crocks/Maybe')

const isString = require('crocks/predicates/isString')
const safe = require('crocks/Maybe/safe')

const MaybeReader =
  ReaderT(Maybe)

const { ask, liftFn } = MaybeReader

// maybeString :: a -> Maybe String
const maybeString =
  safe(isString)

// toUpper :: String -> String
const toUpper =
  x => x.toUpperCase()

// envToUpper :: ReaderT e (Maybe String)
const envToUpper =
  ask()
    .chain(liftFn(maybeString))
    .map(toUpper)

envToUpper
  .runWith(4)
//=> Nothing

envToUpper
  .runWith('hola')
//=> Just "HOLA"

```

#### ap

```haskell
Monad m => ReaderT e (m (a -> b)) ~> ReaderT e (m a) -> ReaderT e (m b)
```

Applies wrapped functions to the provided value, using the `ap` of the
underlying `Monad`. A `ReaderT` of the underlying `Monad` must be provided,
which allows access to the environment.  

```javascript
const Pair = require('crocks/Pair')
const ReaderT = require('crocks/Reader/ReaderT')
const Result = require('crocks/Result')

const fst = require('crocks/Pair/fst')
const snd = require('crocks/Pair/snd')

const ifElse = require('crocks/logic/ifElse')
const isNumber = require('crocks/predicates/isNumber')
const liftA2 = require('crocks/helpers/liftA2')

const { Err, Ok } = Result

const ResultReader =
  ReaderT(Result)

const { ask, liftFn } = ResultReader

// add :: Number -> Number -> Number
const add =
  x => y => x + y

// makeError :: a -> Result [ String ] b
const makeErr =
  x => Err([ `${x} is not a Number` ])

// isValid :: a -> ReaderT e (Result [ String ] Number)
const isValid = liftFn(
  ifElse(isNumber, Ok, makeErr)
)

// first :: ReaderT (Pair a b) (Result [ String ] Number)
const first =
  ask(fst)
    .chain(isValid)

// second :: ReaderT (Pair a b) (Result [ String ] Number)
const second =
  ask(snd)
    .chain(isValid)

// Using a fluent style with of
ResultReader.of(add)
  .ap(first)
  .ap(second)
  .runWith(Pair(34, 21))
//=> Ok 55

// Using a fluent style with map
first
  .map(add)
  .ap(second)
  .runWith(Pair(true, 21))
//=> Err [ "true is not a Number" ]

// Using liftA2
liftA2(add, first, second)
  .runWith(Pair('Bob', 'Jones'))
//=> Err [ 'Bob is not a Number', 'Jones is not a Number' ]
```

#### chain

```haskell
Monad m => ReaderT e (m a) ~> Reader e (a -> ReaderT e (m b)) -> ReaderT e (m b)
```

Can be used to apply the effects of the underlying `Monad` with the benefit of
being able to read from the environment. This method only accepts functions
of the form `Monad m => a -> ReaderT e (m b)`.

```javascript
const ReaderT = require('../crocks/src/Reader/ReaderT')
const Maybe = require('crocks/Maybe')
const prop = require('crocks/Maybe/prop')

const MaybeReader =
  ReaderT(Maybe)

const { ask, liftFn } = MaybeReader

// readProp :: String -> b -> ReaderT e (Maybe a)
const readProp = key =>
  liftFn(prop(key))

// getName :: ReaderT e (Maybe a)
const getName =
  ask()
    .chain(readProp('name'))

// getFirstName :: ReaderT e (Maybe a)
const getFirstName =
  getName
    .chain(readProp('first'))

// getLastName :: ReaderT e (Maybe a)
const getLastName =
  getName
    .chain(readProp('last'))

// person :: Object
const person = {
  name: {
    first: 'Hazel',
    middle: 'Anne'
  }
}

getFirstName
  .runWith(person)
//=> Just "Hazel"

getLastName
  .runWith(person)
//=> Nothing

getLastName
  .runWith(10)
//=> Nothing
```

#### runWith

```haskell
Monad m => ReaderT e (m a) ~> e -> m a
```

In order to unwrap the underlying `Monad`, `ReaderT` needs to be ran with a
given environment. A `ReaderT` instance comes equipped with a `runWith` method
that accepts an environment and returns the resulting `Monad`.

```javascript
const ReaderT = require('../crocks/src/Reader/ReaderT')
const Maybe = require('crocks/Maybe')

const MaybeReader = ReaderT(Maybe)
const { ask, liftFn } = MaybeReader

const prop = require('crocks/Maybe/prop')

// data :: Object
const data = {
  animals: [
    'tiger', 'muskrat', 'mouse'
  ]
}

// length :: Array -> Number
const length =
  x => x.length

// getProp :: String -> ReaderT Object (Maybe [])
const getProp = key =>
  ask()
    .chain(liftFn(prop(key)))

getProp('animals')
  .map(length)
  .runWith(data)
//=> Just 3
```
