---
title: "ReaderT"
description: "Reader Monad Transformer Crock"
layout: "guide"
weight: 120
---

```haskell
Monad m => ReaderT e (m a)
```

`ReaderT` is a `Monad Transformer` that wraps a given `Monad` with a `Reader`.
This allows the interface of a `Reader` that enables the  composition of
computations that depend on a shared environment `(e -> a)`, but provides a way
to abstract a means the `Reader` portion, when combining `ReaderT`s of the same
type. All `ReaderT`s must provide the constructor of the target `Monad` that is
being wrapped.

<article id="topic-implements">

## Implements
`Functor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-constructor">

## Constructor Methods

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

</article>

<article id="topic-instance">

## Instance Methods

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

</article>
