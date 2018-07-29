---
title: "Async"
description: "Async Crock"
layout: "guide"
functions: ["eithertoasync", "firsttoasync", "lasttoasync", "maybetoasync", "resulttoasync"]
weight: 20
---

```haskell
Async e a = Rejected e | Resolved a
```

Defined as a "lazy" Sum Type that implements an asynchronous control structure,
`Async` represents either the success or failure of a given asynchronous
operation. The "laziness" of `Async` allows the ability to build complex
asynchronous operations by defining each portion of that flow as smaller "steps"
that can be composed together.

Depending on your needs, an `Async` can be constructed in a variety of ways. The
typical closely resembles how a `Promise` is constructed with one major
difference, the arguments used in the function that is passed to the `Promise`
constructor are reversed in an `Async` to match the order in which `Async` is
parameterized.

There are many ways to represent asynchronous operations in JavaScript, and as
such, the libraries available to us in our ecosystem provide different means
to take advantage of these operations. The two most common use
either `Promise` returning functions or allow for the Continuation Passing Style
prevalent in the asynchronous functions that ship with NodeJS. `Async` provides
two construction helpers that wrap functions using these styles of asynchronous
processing and will give you back a function that takes the same arguments as
the original and will return an `Async` instead. These functions are
called [`fromPromise`](#frompromise) and [`fromNode`](#fromnode).

`Async` instances wrap asynchronous functions and are considered lazy, in that
they will not run or execute until needed. This typically happens at an edge in
a program and is done by executing the [`fork`](#fork) method available on the
instance, which takes three functions as its arguments.

The first function passed to [`fork`](#fork) will be called on
a [`Rejected`](#rejected) instance and passed the value the `Async` was
rejected with. The second function is called when [`fork`](#fork) is invoked on
a [`Resolved`](#resolved) instance receiving the value the `Async` was resolved
with. The final function is optional and does not need to be provided unless
some clean up is required to happen in response to the cancellation of a
forked `Async` flow. This third function takes no parameters and will ignore
any value that is returned from it. This last function will only be called when
the given flow is canceled by calling the function returned from crocks.

At times, in a given environment, it may not be feasible to run an asynchronous
flow to completion. To address when these use cases pop up,
the [`fork`](#fork) function will return a function that ignores its arguments
and returns `undefined`. When this function is called, `Async` will finish
running the current "in flight" computation to completion, but will cease all
remaining execution. Wrapped functions can return a function that will be called
when an `Async` computation is canceled, this can be used to clear timeouts or
"in flight" XHR requests. Cancellation with `Async` is total and will cancel
silently, without notification.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import maybeToAsync from 'crocks/Async/maybeToAsync'

import First from 'crocks/First'
import equals from 'crocks/pointfree/equals'
import map from 'crocks/pointfree/map'
import mreduceMap from 'crocks/helpers/mreduceMap'
import pick from 'crocks/helpers/pick'
import safe from 'crocks/Maybe/safe'

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// propEq :: (String, a) -> Object -> Boolean
const propEq = (key, value) =>
  x => equals(x[key], value)

// findById :: Foldable f => (a -> Boolean) -> f a -> Maybe a
const findById = id =>
  mreduceMap(First, safe(propEq('id', id)))

// getById :: Number -> Async String Object
function getById(id) {
  const data = [
    { id: 1, name: 'Jimmothy Schmidt', age: 24 },
    { id: 2, name: 'Tori Blackwood', age: 21 },
    { id: 3, name: 'Joey Mc Carthy', age: 27 }
  ]

  return Async(
    (rej, res) => setTimeout(() => res(data), 1000)
  ).chain(maybeToAsync(`id: ${id} -- Not Found`, findById(id)))
}

getById(3)
  .map(pick([ 'id', 'name' ]))
  .fork(log('rej'), log('res'))
//=> res: { id: 3, name: 'Joey Mc Carthy' }

getById(5)
  .map(pick([ 'id', 'name' ]))
  .fork(log('rej'), log('res'))
//=> rej: "id: 5 -- Not Found"

// cancel :: () -> ()
const cancel = getById(1).fork(
  log('rej'),
  log('res'),
  () => console.log('canceled')
)

setTimeout(cancel, 500)
//=> "canceled"

Async
  .all(map(getById, [ 1, 2 ]))
  .map(map(pick([ 'id', 'name' ])))
  .fork(log('rej'), log('res'))
//=> res: [
//=>   { id: 1, name: 'Jimmothy Schmidt' },
//=>   { id: 2, name: 'Tori Blackwood' },
//=> ]

Async
  .all(map(getById, [ 3, 14 ]))
  .map(map(pick([ 'id', 'name' ])))
  .fork(log('rej'), log('res'))
//=> rej:  "id: 14 -- Not Found"

// resolveAfter :: (Integer, a) -> Async e a
const resolveAfter = (delay, value) =>
  Async((rej, res) => {
    const id = setTimeout(() => res(value), delay)
    return () => clearTimeout(id)
  })

// afterCancel :: () -> ()
const afterCancel = resolveAfter(10000, 'Delay Value')
  .fork(log('rej'), log('res'))

afterCancel() // this clears the timeout
```

<article id="topic-implements">

## Implements
`Functor`, `Alt`,  `Bifunctor`, `Apply`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Async :: ((e -> (), a -> ()) -> ()) -> Async e a
Async :: ((e -> (), a -> ()) -> (() -> ()) -> Async e a
```

There are two possible ways to construct an `Async`, depending on the need
or ability to cancel a given `Async` in flight. Both methods of construction
require a binary function that takes two unary functions.

The first function is used to signal the rejection of a given `Async` and will
settle on a `Rejected` instance wrapping whatever was passed to the function.
The second function is used to settle the `Async` to a `Resolved` instance, also
wrapping the value passed to the functions. These functions are provided by
the `Async` and will return `undefined`.

The two ways to construct an `Async` are characterized by the return of the
function you are using to construct it. If anything other than a function is
returned, then the value is ignored.

If however a function is returned, then the function will be run when
the `Async` is canceled while it is "in-flight". This function should be used to
perform any cleanup required in the event of a cancellation. This cleanup
function receives no input and ignores anything that may be returned.

```javascript
import Async from 'crocks/Async'

// Async e String
Async((reject, resolve) => {
  const token =
    setTimeout(() => resolve('fired'), 1000)

  // stop timer on cancel
  return () => { clearTimeout(token) }
})
//=> Resolved "fired"
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Rejected

```haskell
Async.Rejected :: e -> Async e a
```

Used to construct a `Rejected` instance of `Async` that represents the failure
or "false" case of the disjunction. Calling `Rejected` with a given
value, will return a new `Rejected` instance, wrapping the provided value.

When an instance is `Rejected`, most `Async` returning methods on the instance
will return another `Rejected` instance. This is in contrast to a
JavaScript `Promise`, that will continue on a [`Resolved`](#resolved) path after
a `catch`. This behavior of `Promise`s provide challenges when constructing
complicated (or even some simple) `Promise` chains that may fail at various
steps along the chain.

Even though `Async` is a `Bifunctor`, in most cases it is desired to keep the
type of a `Rejected` fixed to a type for a given flow. Given that `Async` is
a `Bifunctor`, it is easy to make sure you get the type you need at the edge
by leaning on [`bimap`](#bimap) to "square things up".

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { Rejected } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// m :: Async String a
const m = Async(
  rej => { rej('Some Error') }
)

// n :: Async String a
const n =
  Rejected('Some Error')

m.fork(log('rej'), log('res'))
//=> rej: "Some Error"

n.fork(log('rej'), log('res'))
//=> rej: "Some Error"
```

#### Resolved

```haskell
Async.Resolved :: a -> Async e a
```

Used to construct a `Resolved` instance that represents the success or "true"
portion of the disjunction. `Resolved` will wrap any given value passed to this
constructor in the `Resolved` instance it returns, signaling the validity of the
wrapped value.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// m :: Async e Number
const m = Async(
  (rej, res) => { res(97) }
)

// n :: Async e Number
const n =
  Resolved(97)

m.fork(log('rej'), log('res'))
//=> res: 97

n.fork(log('rej'), log('res'))
//=> res: 97
```

#### fromPromise

```haskell
Async.fromPromise :: (* -> Promise a e) -> (* -> Async e a)
```

Used to turn an "eager" `Promise` returning function, into a function that takes
the same arguments but returns a "lazy" `Async` instance instead. Due to the
lazy nature of `Async`, any curried interface will not be respected on the
provided function. This can be solved by wrapping the resulting function
with [`nAry`][nary], which will provide a curried function that will return the
desired `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import nAry from 'crocks/helpers/nAry'

const { fromPromise } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// safeProm :: ((a -> Boolean), a) -> Promise a a
const safeProm = (pred, x) => new Promise(
  (res, rej) => ifElse(pred, res, rej, x)
)

safeProm(isNumber, 34)
  .then(log('resProm'))
//=> resProm: 34

safeProm(isNumber, '34')
  .catch(log('rejProm'))
//=> rejProm: "34"

// safeAsync :: (a -> Boolean) -> a -> Async a a
const safeAsync =
  nAry(2, fromPromise(safeProm))

// numAsync :: a -> Async a Number
const numAsync =
  safeAsync(isNumber)

numAsync(34)
  .fork(log('rej'), log('res'))
//=> res: 34

numAsync('34')
  .fork(log('rej'), log('res'))
//=> rej: "34"
```

#### fromNode

```haskell
NodeCallback :: (e, a) -> ()
Async.fromNode :: ((*, NodeCallback) -> ()) -> (* -> Async e a)
Async.fromNode :: (((*, NodeCallback) -> ()), ctx) -> (* -> Async e a)
```

Many of the asynchronous functions that ship with Node JS provide a Continuation
Passing Style, that requires the use of a callback function to be passed as the
last argument. The provided callback functions are binary functions that take
an `err` as the first argument, which is `null` when there is no error to be
reported. The second argument is the `data` representing the result of the
function in the case that there is no error present.

This interface can create the fabled pyramid of callback doom when trying to
combine multiple asynchronous calls. `fromNode` can be used to wrap functions
of this style. Just pass the desired function to wrap and `fromNode` will give
back a new function, that takes the same number of arguments, minus the callback
function.

When the provided function is called, it returns a "lazy" `Async`. When the
resulting instance is forked, if the `err` is a non-null value then the
instance will be [`Rejected`](#rejected) with the `err` value. When the `err` is
null, then the instance will be [`Resolved`](#resolved) with the `data` value.

There are some libraries whose functions are methods on some stateful object.
As such, the need for binding may arise. `fromNode` provides a second, optional
argument that takes the context that will be used to bind the function being
wrapped.

Like [`fromPromise`](#frompromise), any curried interface will not be respected.
If a curried interface is needed then [`nAry`][nary] can be used.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import curry from 'crocks/helpers/curry'
import isNumber from 'crocks/predicates/isNumber'
import nAry from 'crocks/helpers/nAry'
import partial from 'crocks/helpers/partial'

const { fromNode } = Async

// log :: String -> a -> a
const log = curry(label => x =>
  (console.log(`${label}:`, x), x)
)

// NodeCallback :: (e, a) -> ()
// delay :: (Number, a, NodeCallback (String, Number)) -> ()
function delay(delay, val, cb) {
  setTimeout(
    () => isNumber(val) ? cb(null, val) : cb('No Number'),
    delay
  )
}

// callback :: (e, a) -> ()
const callback = (err, data) => {
  err ? log('err', err) : log('data', data)
}

// wait500 :: a -> NodeCallback (String, Number) -> ()
const wait500 =
  partial(delay, 500)

wait500(32, callback)
//=> data: 32

wait500('32', callback)
//=> err: "No Number"

// delayAsync :: Number -> a -> Async String Number
const delayAsync =
  nAry(2, fromNode(delay))

// waitAsync :: a -> Async String Number
const waitAsync =
  delayAsync(1000)

waitAsync(32)
  .fork(log('rej'), log('res'))
//=> res: 32

waitAsync('32')
  .fork(log('rej'), log('res'))
//=> rej: "No Number"
```

#### all

```haskell
Async.all :: [ Async e a ] -> Async e [ a ]
```

`Async` provides an `all` method that can be used when multiple, independent
asynchronous operations need to be run in parallel. `all` takes an `Array` of
`Async` instances that, when forked, will execute each instance in the
provided `Array` in parallel.

If any of the instances result in a [`Rejected`](#rejected) state, the entire flow will
be [`Rejected`](#rejected) with value of the first [`Rejected`](#rejected) instance. If all
instances resolve, then the entire instance is [`Resolved`](#resolved) with
an `Array` containing all [`Resolved`](#resolved) values in their provided order.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { all, Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

all([ Resolved(1), Resolved(2), Resolved(3) ])
  .fork(log('rej'), log('res'))
//=> res: [ 1, 2, 3 ]

all([ Resolved(1), Rejected(2), Rejected(3) ])
  .fork(log('rej'), log('res'))
//=> rej: 2
```

#### resolveAfter

```haskell
Async.resolveAfter :: (Integer, a) -> Async e a
```

Used to resolve a value after a specified number of milliseconds. This function
takes a positive Integer as its first argument and a value to resolve with as
its second. `resolveAfter` returns a new `Async` that will resolve a value
after the specified interval has elapsed.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'
import curry from 'crocks/helpers/curry'

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// delay :: Integer -> a -> Async e a
const delay = curry(
  Async.resolveAfter
)

Async.of('late, but here')
  .chain(delay(1000))
  .fork(log('rejected'), log('resolved'))
//=> resolved: "late, but here"
```

#### rejectAfter

```haskell
Async.rejectAfter :: (Integer, e) -> Async e a
```

Used to reject a value after a specified number of milliseconds. This function
takes a positive Integer as its first argument and a value to reject with as
its second. This can be used to reject and `Async` after a specified period
of time. When used with [`race`](#race), the `Async` provided can be used
to provide a time limit for a given `Async` task.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// resovle :: a -> Async e a
const resolve = x => Async((rej, res) => {
  setTimeout(() => res(x), 1000)
})

resolve('okay')
  .race(Async.rejectAfter(500, 'not okay'))
  .fork(log('reject'), log('resolve'))
//=> reject: "not okay"
```

#### of

```haskell
Async.of :: a -> Async e a
```

Used to wrap any value into an `Async` as a [`Resolved`](#resolved) instance, `of` is
used mostly by helper functions that work "generically" with instances of
either `Applicative` or `Monad`. When working specifically with
the `Async` type, the [`Resolved`](#resolved) constructor should be
used. Reach for `of` when working with functions that will work with
ANY `Applicative`/`Monad`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

Async.of('U Wut M8')
  .fork(log('rej'), log('res'))
//=> res: "U Wut M8"

Resolved('U Wut M8')
  .fork(log('rej'), log('res'))
//=> res: "U Wut M8"

Async((rej, res) => res('U Wut M8'))
  .fork(log('rej'), log('res'))
//=> res: "U Wut M8"
```

</article>

<article id="topic-instance">

## Instance Methods

#### map

```haskell
Async e a ~> (a -> b) -> Async e b
```

Used to apply transformations to [`Resolved`](#resolved) values of an `Async`, `map` takes
a function that it will lift into the context of the `Async` and apply to it
the wrapped value. When ran on a [`Resolved`](#resolved) instance, `map` will apply the
wrapped value to the provided function and return the result in a
new [`Resolved`](#resolved) instance.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import and from 'crocks/logic/and'
import compose from 'crocks/helpers/compose'
import constant from 'crocks/combinators/constant'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'
import map from 'crocks/pointfree/map'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// double :: Number -> Number
const double =
  x => x * 2

// gt10 :: Number -> Boolean
const gt10 =
  x => x > 10

// isValid :: a -> Async String Number
const isValid = ifElse(
  and(isNumber, gt10),
  Resolved,
  constant(Rejected('Not Valid'))
)

// doubleValid :: a -> Async String Number
const doubleValid =
  compose(map(double), isValid)

Resolved(34)
  .map(double)
  .fork(log('rej'), log('res'))
//=> res: 68

Rejected('34')
  .map(double)
  .fork(log('rej'), log('res'))
//=> rej: "34"

doubleValid(76)
  .fork(log('rej'), log('res'))
//=> res: 152

doubleValid('Too Silly')
  .fork(log('rej'), log('res'))
//=> rej: "Not Valid"
```

#### alt

```haskell
Async e a ~> Async e a -> Async e a
```

Providing a means for a fallback or alternative value, `alt` combines two
`Async` instances and will return the first [`Resolved`](#resolved) instance
it encounters or the last [`Rejected`](#rejected) instance if it does not
encounter a [`Resolved`](#resolved) instance.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

Resolved(true)
  .alt(Rejected('Bad News'))
  .fork(log('rej'), log('res'))
//=> res: true

Rejected('First Reject')
  .alt(Rejected('Second Reject'))
  .fork(log('rej'), log('res'))
//=> rej: "Second Reject"

Rejected('First Reject')
  .alt(Resolved('First Resolve'))
  .alt(Rejected('Second Reject'))
  .alt(Resolved('Second Resolve'))
  .fork(log('rej'), log('res'))
//=> rej: "First Resolve"
```

#### bimap

```haskell
Async e a ~> ((e -> b), (a -> c)) -> Async b c
```

Both [`Rejected`](#rejected) and [`Resolved`](#resolved) values can vary in
their type, although most of the time, focus on mapping values is placed on
the [`Resolved`](#resolved) portion. When the requirement or need to map
the [`Rejected`](#rejected) portion arises, `bimap` can be used.

`bimap` takes two functions as its arguments. The first function is used
to map a [`Rejected`](#rejected) instance, while the second maps
a [`Resolved`](#resolved) instance. While `bimap` requires that both possible
instances are to be mapped, if the desire to map only
the [`Rejected`](#rejected) portion, an [`identity`][identity] function can be
provided to the second argument. This will leave
all [`Resolved`](#resolved) instance values untouched.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import assoc from 'crocks/helpers/assoc'
import bimap from 'crocks/pointfree/bimap'
import compose from 'crocks/helpers/compose'
import objOf from 'crocks/helpers/objOf'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// hasError :: Boolean -> Object -> Object
const hasError =
  assoc('hasError')

// buildError :: a -> String
const buildError =
  x => `${x}: is not valid`

// buildResult :: (String, Boolean) -> a -> Object
const buildResult = (key, isError) =>
  compose(hasError(isError), objOf(key))

// finalize :: Bifunctor m => m a b -> m Object Object
const finalize = bimap(
  compose(buildResult('error', true), buildError),
  buildResult('result', false)
)

finalize(Resolved('Good To Go'))
  .fork(log('rej'), log('res'))
//=> res: { result: "Good To Go", hasError: false }

finalize(Rejected(null))
  .fork(log('rej'), log('res'))
//=> rej: { error: "null is not valid", hasError: true }
```

#### ap

```haskell
Async e (a -> b) ~> Async e a -> Async e b
```

Short for apply, `ap` is used to apply an `Async` instance containing a value
to another `Async` instance that contains a function, resulting in
new `Async` instance with the result. `ap` requires that it is called on
an instance that is either [`Rejected`](#rejected) or [`Resolved`](#resolved) that wraps a curried
polyadic function.

When either `Async` is [`Rejected`](#rejected), `ap` will return a [`Rejected`](#rejected) instance, that
wraps the value of the original [`Rejected`](#rejected) instance. This can be used to safely
combine multiple values under a given combination function. If any of the inputs
result in a [`Rejected`](#rejected) than they will never be applied to the function and will
not result in undesired exceptions or results.

When [`fork`](#fork)ed, all `Async`s chained with multiple `ap` invocations
will be executed concurrently.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import liftA2 from 'crocks/helpers/liftA2'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// resolveAfter :: (Integer, a) -> Async e a
const resolveAfter = (delay, x) => Async(
  (rej, res) => setTimeout(() => res(x), delay)
)

// join :: String -> String -> String
const join =
  a => b => `${a} ${b}`

Async.of(join)
  .ap(Resolved('blip'))
  .ap(Resolved('blop'))
  .fork(log('rej'), log('res'))
//=> res: "blip blop"

Async.of(join)
  .ap(Resolved('blip'))
  .ap(Rejected('Not Good'))
  .fork(log('rej'), log('res'))
//=> rej: "Not Good"

Resolved('splish')
  .map(join)
  .ap(Resolved('splash'))
  .fork(log('rej'), log('res'))
//=> res: "splish splash"

// first :: Async e String
const first =
  resolveAfter(5000, 'first')

// second :: Async e String
const second =
  resolveAfter(5000, 'second')

// `ap` runs all Asyncs at the same time in parallel.
// This will finish running in about 5 seconds and
// not 10 seconds

liftA2(join, first, second)
  .fork(log('rej'), log('res'))
//=> res: "first second"
```

#### chain

```haskell
Async e a ~> (a -> Async e b) -> Async e b
```

Combining a sequential series of transformations that capture disjunction can be
accomplished with `chain`. `chain` expects a unary, `Async` returning function
as its argument. When invoked on a [`Rejected`](#rejected) instance , `chain` will not run
the function, but will instead return another [`Rejected`](#rejected) instance wrapping the
original [`Rejected`](#rejected) value. When called on a [`Resolved`](#resolved) instance however, the
inner value will be passed to provided function, returning the result as the
new instance.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import chain from 'crocks/pointfree/chain'
import compose from 'crocks/helpers/compose'
import composeK from 'crocks/helpers/composeK'
import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import ifElse from 'crocks/logic/ifElse'
import isString from 'crocks/predicates/isString'
import prop from 'crocks/Maybe/prop'
import maybeToAsync from 'crocks/Async/maybeToAsync'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// safe :: (b -> Boolean) -> b -> Async String a
const safe = pred =>
  ifElse(pred, Resolved, constant(Rejected('Not Safe')))

// test :: RegExp -> String -> Boolean
const test = regex => str =>
  regex.test(str)

// lookup :: String -> Async String String
const lookup = compose(
  maybeToAsync('Not Found'),
  flip(prop, { 'file-a': 'file-b', 'file-b': 'file-c' })
)

// fake :: String -> Async String Object
const fake = compose(
  chain(lookup),
  chain(safe(test(/^file-(a|b|c)/))),
  chain(safe(isString))
)

fake('file-a')
  .fork(log('rej'), log('res'))
//=> file-b

// getTwo :: a -> Async String String
const getTwo =
  composeK(fake, fake)

getTwo('file-a')
  .fork(log('rej'), log('res'))
//=> res: file-c

getTwo('file-b')
  .fork(log('rej'), log('res'))
//=> rej: "Not Found"

getTwo(76)
  .fork(log('rej'), log('res'))
//=> rej: "Not Safe"
```

#### coalesce

```haskell
Async e a ~> ((e -> b), (a -> b))) -> Async e b
```
Used as a means to apply a computation to a [`Resolved`](#resolved) instance and then map
any [`Rejected`](#rejected) value while transforming it to a [`Resolved`](#resolved) to continue
computation. `coalesce` on an `Async` can be used to model the all too
familiar, and more imperative `if/else` flow in a more declarative manner.

The first function is used when invoked on a [`Rejected`](#rejected) instance and will
return a [`Resolved`](#resolved) instance wrapping the result of the function. The second
function is used when `coalesce` is invoked on a [`Resolved`](#resolved) instance and is used
to map the original value, returning a new [`Resolved`](#resolved) instance wrapping the
result of the second function.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import coalesce from 'crocks/pointfree/coalesce'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// label :: String -> String -> String
const label =
  lbl => x => `${lbl} ${x}`

// resolve :: Async e String -> Async e String
const resolve =
  coalesce(label('Was'), label('Still'))

resolve(Resolved('Resolved'))
  .fork(log('rej'), log('res'))
//=> res: "Still Resolved"

resolve(Rejected('Rejected'))
  .fork(log('rej'), log('res'))
//=> res: "Was Rejected"
```

#### swap

```haskell
Async e a ~> ((e -> b), (a -> c)) -> Async c b
```

Used to map the value of a [`Rejected`](#rejected) into a [`Resolved`](#resolved) or a [`Resolved`](#resolved) to
a [`Rejected`](#rejected), `swap` takes two functions as its arguments. The first function
is used to map the expected [`Rejected`](#rejected) value into a [`Resolved`](#resolved), while the
second goes from [`Resolved`](#resolved) to [`Rejected`](#rejected). If no mapping is required on either,
then [`identity`][identity] functions can be used in one or both arguments.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import compose from 'crocks/helpers/compose'
import identity from 'crocks/combinators/identity'
import swap from 'crocks/pointfree/swap'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// length :: String -> Integer
const length =
  x => x.length

// repeat :: String -> Number -> String
const repeat =
  char => n => char.repeat(n)

// values :: Async String Number -> Async String Number
const values =
  swap(length, repeat('a'))

// valueIso :: Async String Number -> Async String Number
const valueIso =
  compose(values, values)

// types :: Async a b -> b a
const types =
  swap(identity, identity)

// typeIso :: Async a b -> b a
const typeIso =
  compose(types, types)

values(Resolved(5))
  .fork(log('rej'), log('res'))
//=> rej: "aaaaa"

values(Rejected('aaaaa'))
  .fork(log('rej'), log('res'))
//=> res: 5

valueIso(Resolved(5))
  .fork(log('rej'), log('res'))
//=> res: 5

valueIso(Rejected('aaaaa'))
  .fork(log('rej'), log('res'))
//=> rej: "aaaaa"

types(Resolved(5))
  .fork(log('rej'), log('res'))
//=> rej: 5

types(Rejected('aaaaa'))
  .fork(log('rej'), log('res'))
//=> res: "aaaaa"

typeIso(Resolved(5))
  .fork(log('rej'), log('res'))
//=> res: 5

typeIso(Rejected('aaaaa'))
  .fork(log('rej'), log('res'))
//=> rej: "aaaaa"
```

#### race

```haskell
Async e a ~> Async e a -> Async e a
```

Used to provide the first settled result between two `Async`s. Just pass `race`
another `Async` and it will return new `Async`, that when forked, will run both
`Async`s in parallel, returning the first of the two to settle. The result can
either be rejected or resolved, based on the instance of the first settled
result.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from '../crocks/src/Async'

const { resolveAfter, rejectAfter } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

resolveAfter(300, 'I win')
  .race(resolveAfter(400, 'I lose'))
  .fork(log('rejected'), log('resolved'))
//=> resolved: "I win"

rejectAfter(500, 'I lose')
  .race(rejectAfter(300, 'I win'))
  .fork(log('rejected'), log('resolved'))
//=> rejected: "I win"

resolveAfter(500, 'I lose')
  .race(rejectAfter(300, 'I win'))
  .fork(log('rejected'), log('resolved'))
//=> rejected: "I win"
```

#### fork

```haskell
Async e a ~> ((e -> ()), (a -> ())) -> (() -> ())
Async e a ~> ((e -> ()), (a -> ()), (() -> ())) -> (() -> ())
```

The `Async` type is lazy and will not be executed until told to do so
and `fork` is the primary method used for execution. `fork` implements two
signatures depending on the need for clean up in the event of cancellation, but
both return a function that can be used for cancellation of a given instance.

The first and more common signature takes two functions that will have their
return values ignored. The first function will be run in the event of the
`Async` instance settling on [`Rejected`](#rejected) and will receive as its single argument
the value or "cause" of rejection. The second function provided will be executed
in the case of the instance settling on [`Resolved`](#resolved) and will receive as its
single argument the value the `Async` was resolved with.

The second signature is used when any cleanup needs to be performed after a
given `Async` is canceled by having the function returned from `fork` called.
The first two arguments to the signature are the same as the more common
signature described above, but takes an addition function that can be used
for "clean up" after cancellation. When all in-flight computations settle, the
function provided will be silently executed.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import compose from 'crocks/helpers/compose'

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// inc :: Number -> Number
const inc =
  n => n + 1

// delay :: a -> Async e a
const delay = x => Async(
  (rej, res) => { setTimeout(() => res(x), 1000) }
).map(compose(inc, log('value')))

delay(0)
  .chain(delay)
  .chain(delay)
  .fork(log('rej'), log('res'))
//=> value: 0
//=> value: 1
//=> value: 2
//=> res: 3

const cancel =
  delay(0)
    .chain(delay)
    .chain(delay)
    .fork(log('rej'), log('res'))
//=> value: 0
//=> value: 1

setTimeout(cancel, 2200)
```

#### toPromise

```haskell
Async e a ~> () -> Promise a e
```

While [`fork`](#fork) is the more common method for running an `Async` instance,
there may come time where a `Promise` is needed at the edge of a given program
or flow. When the need to integrate into an existing `Promise` chain
arises, `Async` provides the `toPromise` method.

`toPromise` takes no arguments and when invoked will fork the instance
internally and return a `Promise` that will be in-flight. This comes in handy
for integration with other `Promise` based libraries that are utilized in a
given application, program or flow.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

const { Rejected, Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

Resolved('resolved')
  .toPromise()
  .then(log('res'))
  .catch(log('rej'))
//=> res: resolved

Rejected('rejected')
  .toPromise()
  .then(log('res'))
  .catch(log('rej'))
//=> rej: rejected
```

</article>

<article id="topic-pointfree">

## Pointfree Functions

#### race (pointfree)

`crocks/Async/race`

```haskell
race :: Async e a -> Async e a -> Async e a
```

The `race` pointfree function accepts two `Async` instances and will return
a new `Async` instance that is the result of applying the first argument to
the [`race`](#race) method on the second passed instance.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import race from 'crocks/Async/race'
import Async from 'crocks/Async'

const { resolveAfter, rejectAfter } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// timeout :: Async Error a -> Async Error a
const timeout =
  race(rejectAfter(300, new Error('Request has timed out')))

// fast :: Async e String
const fast =
  resolveAfter(150, 'All good')

// slow :: Async e Boolean
const slow =
  resolveAfter(900, true)

timeout(fast)
  .fork(log('rejected'), log('resolved'))
//=> resolved: "All good"

timeout(slow)
  .fork(log('rejected'), log('resolved'))
//=> rejected: "Error: Request has timed out"
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### eitherToAsync

`crocks/Async/eitherToAsync`

```haskell
eitherToAsync :: Either b a -> Async b a
eitherToAsync :: (a -> Either c b) -> a -> Async c b
```

Used to transform a given [`Either`][either] instance to
an `Async` instance, `eitherToAsync` will turn a [`Right`][right] instance into
a [`Resolved`](#resolved) instance wrapping the original value contained in the
original [`Right`][right]. If a [`Left`][left] is provided,
then `eitherToAsync` will return a [`Rejected`](#rejected) instance, wrapping
the original [`Left`][left] value.

Like all `crocks` transformation functions, `eitherToAsync` has two possible
signatures and will behave differently when passed either
an [`Either`][either] instance or a function that returns an instance
of [`Either`][either]. When passed the instance, a transformed `Async` is
returned. When passed an [`Either`][either] returning function, a function will
be returned that takes a given value and returns an `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'
import Either from 'crocks/Either'

import eitherToAsync from 'crocks/Async/eitherToAsync'

import and from 'crocks/logic/and'
import ifElse from 'crocks/logic/ifElse'
import isNumber from 'crocks/predicates/isNumber'

const { Resolved } = Async
const { Left, Right } = Either

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// gte :: Number -> Number -> Boolean
const gte =
  x => y => y >= x

// isLarge :: a -> Boolean
const isLarge =
  and(isNumber, gte(10))

// isValid :: a -> Either String a
const isValid = ifElse(
  isLarge,
  Right,
  x => Left(`${x} is not valid`)
)

eitherToAsync(Right('Correct'))
  .fork(log('rej'), log('res'))
//=> res: "Correct"

eitherToAsync(Left('Not Good'))
  .fork(log('rej'), log('res'))
//=> rej: "Not Good"

Resolved(54)
  .chain(eitherToAsync(isValid))
  .fork(log('rej'), log('res'))
//=> res: 54

Resolved(4)
  .chain(eitherToAsync(isValid))
  .fork(log('rej'), log('res'))
//=> rej: "4 is not valid"

Resolved('Bubble')
  .chain(eitherToAsync(isValid))
  .fork(log('rej'), log('res'))
//=> rej: "Bubble is not valid"
```

#### firstToAsync

`crocks/Async/firstToAsync`

```haskell
firstToAsync :: e -> First a -> Async e a
firstToAsync :: e -> (a -> First b) -> a -> Async e b
```

Used to transform a given [`First`][first] instance to
an `Async` instance, `firstToAsync` will turn a non-empty [`First`][first] instance into
a [`Resolved`](#resolved) instance wrapping the original value contained in the
original non-empty.

The [`First`][first] datatype is based on a [`Maybe`][maybe] and as such its left or empty value
is fixed to a `()` type. As a means to allow for convenient
transformation, `firstToAsync` takes a default [`Rejected`](#rejected) value as the first
argument. This value will be wrapped in a resulting [`Rejected`](#rejected) instance in the
case of empty.

Like all `crocks` transformation functions, `firstToAsync` has two possible
signatures and will behave differently when passed either a [`First`][first] instance
or a function that returns an instance of [`First`][first]. When passed the instance,
a transformed `Async` is returned. When passed a [`First`][first] returning function,
a function will be returned that takes a given value and returns an `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'
import First from 'crocks/First'

import firstToAsync from 'crocks/Async/firstToAsync'

import Pred from 'crocks/Pred'
import isString from 'crocks/predicates/isString'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

const { Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// length :: String -> Number
const length =
  x => x.length

// gte :: Number -> Number -> Boolean
const gte =
  x => y => y >= x

// isValid :: Pred String
const isValid =
  Pred(isString)
    .concat(Pred(gte(4)).contramap(length))

// firstValid :: [ String ] -> First String
const firstValid =
  mconcatMap(First, safe(isValid))

// findFirstValid :: [ String ] -> Async String String
const findFirstValid =
  firstToAsync('Nothing Found', firstValid)

firstToAsync('Error', First(true))
  .fork(log('rej'), log('res'))
//=> res: true

firstToAsync('Error', First.empty())
  .fork(log('rej'), log('res'))
//=> rej: "Error"

Resolved([ 'cat', 'rhino', 'unicorn' ])
  .chain(findFirstValid)
  .fork(log('rej'), log('res'))
//=> res: "rhino"

Resolved([ 1, 2, 3 ])
  .chain(findFirstValid)
  .fork(log('rej'), log('res'))
//=> rej: "Nothing Found"

Resolved([ 'cat', 'bat', 'imp' ])
  .chain(findFirstValid)
  .fork(log('rej'), log('res'))
//=> rej: "Nothing Found"
```

#### lastToAsync

`crocks/Async/lastToAsync`

```haskell
lastToAsync :: e -> Last a -> Async e a
lastToAsync :: e -> (a -> Last b) -> a -> Async e b
```

Used to transform a given [`Last`][last] instance to
an `Async` instance, `lastToAsync` will turn a non-empty [`Last`][last] instance into
a [`Resolved`](#resolved) instance wrapping the original value contained in the
original non-empty.

The [`Last`][last] datatype is based on a [`Maybe`][maybe] and as such its left or empty value
is fixed to a `()` type. As a means to allow for convenient
transformation, `lastToAsync` takes a default [`Rejected`](#rejected) value as the first
argument. This value will be wrapped in a resulting [`Rejected`](#rejected) instance, in the
case of empty.

Like all `crocks` transformation functions, `lastToAsync` has two possible
signatures and will behave differently when passed either a [`Last`][last] instance
or a function that returns an instance of [`Last`][last]. When passed the instance,
a transformed `Async` is returned. When passed a [`Last`][last] returning function,
a function will be returned that takes a given value and returns an `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'
import Last from 'crocks/Last'

import lastToAsync from 'crocks/Async/lastToAsync'

import Pred from 'crocks/Pred'
import isString from 'crocks/predicates/isString'
import mconcatMap from 'crocks/helpers/mconcatMap'
import safe from 'crocks/Maybe/safe'

const { Resolved } = Async

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// length :: String -> Number
const length =
  x => x.length

// gte :: Number -> Number -> Boolean
const gte =
  x => y => y >= x

// isValid :: Pred String
const isValid =
  Pred(isString)
    .concat(Pred(gte(4)).contramap(length))

// lastValid :: [ String ] -> Last String
const lastValid =
  mconcatMap(Last, safe(isValid))

// findLastValid :: [ String ] -> Async String String
const findLastValid =
  lastToAsync('Nothing Found', lastValid)

lastToAsync('Error', Last(true))
  .fork(log('rej'), log('res'))
//=> res: true

lastToAsync('Error', Last.empty())
  .fork(log('rej'), log('res'))
//=> rej: "Error"

Resolved([ 'unicorn', 'rhino', 'cat' ])
  .chain(findLastValid)
  .fork(log('rej'), log('res'))
//=> res: "rhino"

Resolved([ 1, 2, 3 ])
  .chain(findLastValid)
  .fork(log('rej'), log('res'))
//=> rej: "Nothing Found"

Resolved([ 'cat', 'bat', 'imp' ])
  .chain(findLastValid)
  .fork(log('rej'), log('res'))
//=> rej: "Nothing Found"
```

#### maybeToAsync

`crocks/Async/maybeToAsync`

```haskell
maybeToAsync :: e -> Maybe a -> Async e a
maybeToAsync :: e -> (a -> Maybe b) -> a -> Async e b
```

Used to transform a given [`Maybe`][maybe] instance to
an `Async` instance, `maybeToAsync` will turn a [`Just`][just] instance into
a [`Resolved`](#resolved) instance wrapping the original value contained in the
original [`Just`][just].

A [`Nothing`][nothing] instance is fixed to a `()` type and as such can only ever contain
a value of `undefined`. As a means to allow for convenient
transformation, `maybeToAsync` takes a default [`Rejected`](#rejected) value as the first
argument. This value will be wrapped in a resulting [`Rejected`](#rejected) instance, in the
case of [`Nothing`][nothing].

Like all `crocks` transformation functions, `maybeToAsync` has two possible
signatures and will behave differently when passed either a [`Maybe`][maybe] instance
or a function that returns an instance of [`Maybe`][maybe]. When passed the instance,
a transformed `Async` is returned. When passed a [`Maybe`][maybe] returning function,
a function will be returned that takes a given value and returns an `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'
import Maybe from 'crocks/Maybe'

import maybeToAsync from 'crocks/Async/maybeToAsync'

import and from 'crocks/logic/and'
import isEmpty from 'crocks/predicates/isEmpty'
import isArray from 'crocks/predicates/isArray'
import not from 'crocks/logic/not'
import safe from 'crocks/Maybe/safe'

const { Resolved } = Async
const { Nothing, Just } = Maybe

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// isValid :: a -> Maybe [ b ]
const isValid = safe(
  and(isArray, not(isEmpty))
)

maybeToAsync(false, Just(true))
  .fork(log('rej'), log('res'))
//=> res: true

maybeToAsync('Bad', Nothing())
  .fork(log('rej'), log('res'))
//=> rej: "Bad"

Resolved([ 'a', 'b', 'c' ])
  .chain(maybeToAsync('Invalid', isValid))
  .fork(log('rej'), log('res'))
//=> res: [ 'a', 'b', 'c' ]

Resolved([])
  .chain(maybeToAsync('Invalid', isValid))
  .fork(log('rej'), log('res'))
//=> rej: "Invalid"

Resolved('')
  .chain(maybeToAsync('Invalid', isValid))
  .fork(log('rej'), log('res'))
//=> rej: "Invalid"
```

#### resultToAsync

`crocks/Async/resultToAsync`

```haskell
resultToAsync :: Result b a -> Async b a
resultToAsync :: (a -> Result c b) -> a -> Async c b
```

Used to transform a given `Result` instance to
an `Async` instance, `resultToAsync` will turn an `Ok` instance into
a [`Resolved`](#resolved) instance wrapping the original value contained in the
original `Ok`. If an `Err` is provided, then `resultToAsync` will return
a [`Rejected`](#rejected) instance, wrapping the original `Err` value.

Like all `crocks` transformation functions, `resultToAsync` has two possible
signatures and will behave differently when passed either a `Result` instance
or a function that returns an instance of `Result`. When passed the instance,
a transformed `Async` is returned. When passed a `Result` returning function,
a function will be returned that takes a given value and returns an `Async`.

<!-- eslint-disable no-console -->
<!-- eslint-disable no-sequences -->

```javascript
import Async from 'crocks/Async'

import Result from 'crocks/Result'

import resultToAsync from 'crocks/Async/resultToAsync'

import identity from 'crocks/combinators/identity'
import isNumber from 'crocks/predicates/isNumber'
import tryCatch from 'crocks/Result/tryCatch'

const { Resolved } = Async

const { Err, Ok }  = Result

// log :: String -> a -> a
const log = label => x =>
  (console.log(`${label}:`, x), x)

// notNumber :: a -> Number
function notNumber(x) {
  if (!isNumber(x)) {
    throw new TypeError('Must be a Number')
  }
  return x
}

// safeFail :: a -> Result TypeError Number
const safeFail =
  tryCatch(notNumber)

resultToAsync(Ok(99))
  .fork(log('rej'), log('res'))
//=> res: 99

resultToAsync(Err('Not Good'))
  .fork(log('rej'), log('res'))
//=> rej: "Not Good"

Resolved(103)
  .chain(resultToAsync(safeFail))
  .bimap(x => x.message, identity)
  .fork(log('rej'), log('res'))
//=> res: 103

Resolved('103')
  .chain(resultToAsync(safeFail))
  .bimap(x => x.message, identity)
  .fork(log('rej'), log('res'))
//=> rej: "Must be a Number"
```

</article>

[nary]: ../functions/helpers.html#nary
[identity]: ../functions/combinators.html#identity
[first]: ../monoids/First.html
[last]: ../monoids/Last.html
[maybe]: ./Maybe.html
[just]: ./Maybe.html#just
[nothing]: ./Maybe.html#nothing
[either]: ./Either.html
[left]: ./Either.html#left
[right]: ./Either.html#right
