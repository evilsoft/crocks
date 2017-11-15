[![Build Status](https://travis-ci.org/evilsoft/crocks.svg?branch=master)](https://travis-ci.org/evilsoft/crocks) [![Coverage Status](https://coveralls.io/repos/github/evilsoft/crocks/badge.svg?branch=master)](https://coveralls.io/github/evilsoft/crocks?branch=master)
[![Join the chat at https://gitter.im/crocksjs/crocks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crocksjs/crocks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM version](https://badge.fury.io/js/crocks.svg)](https://www.npmjs.com/package/crocks)

# crocks.js
`crocks` is a collection of popular *Algebraic Data Types (ADTs)* that are all
the rage in functional programming. You have heard of things like `Maybe` and
`Either` and heck maybe even `IO`, that is what these are. The main goal of
`crocks` is to curate and provide not only a common interface between each type
(where possible of course), but also all of the helper functions needed to hit
the ground running.

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need
to do is run the following to save it as a dependency in your current project
folder:

```
$ npm install crocks -S
```

This will pull down `crocks` into your project's `node_modules` folder and can
be accessed by adding something like the following in the file that needs it:

```javascript
// node require syntax
const crocks = require('crocks')

// Javascript modules (if you are transpiling)
import crocks from 'crocks'
```

This lib *should* work, with no additional compilation in all current browsers
(Edge, Safari, Chrome, Firefox), if it does not, please file an issue as I
really, really want it to. :smile_cat:.

There is a lot to this library, and as such it may not be desired to bring in
the entire library when bundling for a library or a frontend application. If
this is the case, the code is organized in a manner groups all types in
functions that construct those type in their own folders. The general purpose
functions are spread across the following folders: `combinators`, `helpers`,
`logic`, `pointfree` and `predicates`.

To access the types, just reference the folder like: `crocks/Maybe`, or
`crocks/Result`. If you want to access a function that constructs a given type,
reference it by name, like: `crocks/Maybe/safe` or `crocks/Result/tryCatch`.
This organization helps ensure that you only include what you need.

Another thing to note is, if you are transpiling, then destructuring in your
`import` statement is not going to work as you are thinking (maybe if you are
using `babel`, but this will be broken once modules are available in node, so
be careful). Basically you should not do this, as `crocks` will not be set up
for it until modules are available in node:

```javascript
// Nope! Nope! Nope!:
import { Maybe, compose, curry, map } from 'crocks'

// instead do something like this:
import crocks from 'crocks'
const { Maybe, compose, curry, map } = crocks

// do not wanna bring all of crocks into your bundle?
// I feel ya, all try this:

import Maybe from 'crocks/Maybe'
import compose from 'crock/helpers/compose'
import curry from 'crocks/helpers/curry'
import map from 'crocks/pointfree/map'

// you can of course do the same with require statements:
const All = require('crocks/All')
...
```

## What is in this?
There are (8) classifications of "things" included in this library:

* [Crocks](#crocks): These are the ADTs that this library is centered around.
They are all `Functor` based Data Types that provide different computational
contexts for working in a more declarative, functional flow. For the most part,
a majority of the other bits in `crocks` exist to serve these ADTs.

* [Monoids](#monoids): These helpful ADTs are in a class of their own, not
really `Functor`s in their own right (although some can be), they are still very
useful in our everyday programming needs. Ever need to Sum a list of Numbers or
mix a mess of objects together? This is were you will find the ADTs you need to
do that.

* [Combinators](#combinators): A collection of functions that are used for
working with other functions. These do things like compose (2) functions
together, or flip arguments on a function. They typically either take a
function, return a function or a bit a both. These are considered the glue that
holds the mighty house of `crocks` together and a valuable aid in writing
reusable code.

* [Helper Functions](#helper-functions): All other support functions that are
either convenient versions of combinators or not even combinators at all cover
this group.

* [Logic Functions](#logic-functions): A helpful collection of Logic based
combinators. All of these functions work with predicate functions and let you
combine them in some very interesting ways.

* [Predicate Functions](#predicate-functions): A helpful collection of predicate
functions to get you started.

* [Point-free Functions](#point-free-functions): Wanna use these ADTs in a way
that you never have to reference the actual data being worked on? Well here is
where you will find all of these functions to do that. For every algebra
available on both the `Crocks` and `Monoids` there is a function here.

* [Transformation Functions](#transformation-functions): All the functions found
here are used to transform from one type to another, naturally. These come are
handy in situations where you have functions that return one type (like an
`Either`), but are working in a context of another (say `Maybe`). You would
like to compose these, but in doing so will result in a nesting that you will
need to account for for the rest of your flow.

### Crocks
The `crocks` are the heart and soul of this library. This is where you will find
all your favorite ADT's you have grown to :heart:. They include gems such as:
`Maybe`, `Either` and `IO`, to name a few. The are usually just a simple
constructor that takes either a function or value (depending on the type)
and will return you a "container" that wraps whatever you passed it. Each
container provides a variety of functions that act as the operations you can do
on the contained value. There are many types that share the same function names,
but what they do from type to type may vary.  Every Crock provides type function
on the Constructor and both inspect and type functions on their Instances.

All `Crocks` are Constructor functions of the given type, with `Writer` being an
exception. The `Writer` function takes a [`Monoid`](#monoids) that will
represent the `log`. Once you provide the [`Monoid`](#monoids), the function
will return the `Writer` Constructor for your `Writer` using that specific
[`Monoid`](#monoids).

| Crock | Constructor | Instance |
|---|:---|:---|
| `Arrow` | `id` | `both`, `compose`, `contramap`, `empty`, `first`, `map`, `promap`, `runWith`, `second` |
| `Async` | `Rejected`, `Resolved`, `all`, `fromNode`, `fromPromise`, `of` | `alt`, `ap`, `bimap`, `chain`, `coalesce`, `fork`, `map`, `of`, `swap`, `toPromise` |
| `Const` | -- | `ap`, `chain`, `concat`, `equals`, `map`, `valueOf` |
| `Either` | `Left`, `Right`, `of`| `alt`, `ap`, `bimap`, `chain`, `coalesce`, `concat`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse` |
| `Identity` | `of` | `ap`, `chain`, `concat`, `equals`, `map`, `of`, `sequence`, `traverse`, `valueOf` |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `fromArray`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `head`, `map`, `of`, `reduce`, `reject`, `sequence`, `tail`, `toArray`, `traverse`, `valueOf` |
| `Maybe` | `Nothing`, `Just`, `of`, `zero` | `alt`, `ap`, `chain`, `coalesce`, `concat`, `equals`, `either`, `map`, `of`, `option`, `sequence`, `traverse`, `zero` |
| `Pair` | --- | `ap`, `bimap`, `chain`, `concat`, `equals`, `extend`, `fst`, `map`, `merge`, `of`, `snd`, `swap`, `toArray` |
| `Pred` * | `empty` | `concat`, `contramap`, `empty`, `runWith`, `valueOf` |
| `Reader` | `ask`, `of`| `ap`, `chain`, `map`, `of`, `runWith` |
| `Result` | `Err`, `Ok`, `of`| `alt`, `ap`, `bimap`, `chain`, `coalesce`, `concat`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse` |
| `Star` | `id` | `both`, `compose`, `contramap`, `map`, `promap`, `runWith` |
| `State` | `get`, `modify` `of`, `put`| `ap`, `chain`, `evalWith`, `execWith`, `map`, `of`, `runWith` |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `valueOf` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `valueOf` |

\* based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)

### Monoids
Each `Monoid` provides a means to represent a binary operation and is usually
locked down to a specific type. These are great when you need to combine a list
of values down to one value. In this library, any ADT that provides both an
`empty` and `concat` function can be used as a `Monoid`. There are a few of the
[`crocks`](#crocks) that are also monoidial, so be on the look out for those as
well. All `Monoids` work with the point-free functions [`mconcat`](#mconcat),
[`mreduce`](#mreduce), [`mconcatMap`](#mconcatmap) and
[`mreduceMap`](#mreducemap).

All `Monoids` provide `empty` and `type` function on their Constructors as well
as the following Instance Functions: inspect, `type`, `valueOf`, `empty` and
`concat`.


| Monoid | Type | Operation | Empty (Identity) |
|---|---|---|---|
| `All` | Boolean | Logical AND | `true` |
| `Any` | Boolean | Logical OR | `false` |
| `Assign` | Object | `Object.assign` | `{}` |
| `Endo` | Function | `compose` | `identity` |
| `First` | Maybe | First `Just` | `Nothing` |
| `Last` | Maybe | Last `Just` | `Nothing` |
| `Max` | Number | `Math.max` | `-Infinity` |
| `Min` | Number | `Math.min` | `Infinity` |
| `Prod` | Number | Multiplication | `1` |
| `Sum` | Number | Addition | `0` |

### Combinators
#### applyTo
`crocks/combinators/applyTo`
```haskell
applyTo :: (a -> b) -> a -> b
```
Seems really silly, but is quite useful for a lot of things. It takes a function
and a value and then returns the result of that function with the argument
applied.

#### composeB
`crocks/combinators/composeB`
```haskell
composeB :: (b -> c) -> (a -> b) -> a -> c
```
Provides a means to describe a composition between two functions. it takes two
functions and a value. Given `composeB(f, g)`, which is read `f` after `g`, it
will return a function that will take value `a` and apply it to `g`, passing the
result as an argument to `f`, and will finally return the result of `f`. (This
allows only two functions, if you want to avoid things like:
`composeB(composeB(f, g), composeB(h, i))` then check out
[`compose`](#compose).)

#### constant
`crocks/combinators/constant`
```haskell
constant :: a -> _ -> a
```
This is a very handy dandy function, used a lot. Pass it any value and it will
give you back a function that will return that same value no matter what you
pass it.

#### flip
`crocks/combinators/flip`
```haskell
flip :: (a -> b -> c) -> b -> a -> c
```
This little function just takes a function and returns a function that takes the
first two parameters in reverse. One can compose flip calls down the line to
flip all, or some of the other parameters if there are more than two. Mix and
match to your :heart:'s desire.

#### identity
`crocks/combinators/identity`
```haskell
identity ::  a -> a
```
This function and [`constant`](#constant) are the workhorses of writing code
with this library. It quite simply is just a function that when you pass it
something, it returns that thing right back to you. So simple, I will leave it
as an exercise to reason about why this is so powerful and important.

#### reverseApply
`crocks/combinators/reverseApply`
```haskell
reverseApply :: a -> (a -> b) -> b
```
Ever run into a situation where you have a value but do not have a function to
apply it to? Well this little bird, named Thrush, is there to help out. Just
give it a value and it will give you back a function ready to take a function.
Once that function is provided, it will return the result of applying your value
to that function.

#### substitution
`crocks/combinators/substitution`
```haskell
substitution :: (a -> b -> c) -> (a -> b) -> a -> c
```
While it a complicated little bugger, it can come in very handy from time to
time. In it's first two arguments it takes functions. The first must be binary
and the second unary. That will return you a function that is ready to take some
value. Once supplied the fun starts, it will pass the `a` to the first argument
of both functions, and the result of the second function to the second parameter
of the first function. Finally after all that juggling, it will return the
result of that first function. When used with partial application on that first
parameter, a whole new world of combinatory madness is presented!

### Helper Functions
#### assign
`crocks/helpers/assign`
```haskell
assign :: Object -> Object -> Object
```
When working with `Object`s, a common operation is to combine (2) of them. This
can be accomplished in `crocks` by reaching for `assign`. Unlike the
`Object.assign` that ships with JavaScript, this `assign` will combine your
`Object`s into a new shallow copy of their merger. `assign` only takes two
arguments and will overwrite keys present in the second argument with values
from the first. As with most of the `crocks` `Object` based functions, `assign`
will omit any key-value pairs that are `undefined`. Check out a related function
named [`defaultProps`](#defaultprops) that will only assign values that are
`undefined` in the second argument.

#### assoc
`crocks/helpers/assoc`
```haskell
assoc :: String -> a -> Object -> Object
```
There may come a time when you want to add a key-value pair to an `Object` and
want control over how the key and value are applied. That is where `assoc` can
come to your aid. Just provide a `String` key and a value of any type to be
associated to the key. Finally pass it any `Object` and you will get back a
shallow copy with your key-value pair merged in. This will overwrite any exiting
keys with new value specified. Used with [`flip`](#flip), you can do some
interesting things with this function, give it a play! If you just want to
create an `Object` and not concatenate it to another `Object`, [`objOf`](#objof)
may be the function for you.

#### binary
`crocks/helpers/binary`
```haskell
binary :: (* -> c) -> a -> b -> c
```
With all the different functions out there in the real world, sometimes it is
nice to restrict them to a specific -arity to work with your all your wonderful
compositions. When you want to restict any function of any arity to a simple
binary function. Just pass your function to `binary` and you will get back a
curried, binary function that will only apply (2) arguments to the inner
function, ignoring any others. This works very well with functions like
`Array.prototype.reduce` where you may only care about the first 2 arguments.
if you need to constrain to more than (2) arguments, then you will want to reach
for  [`nAry`](#nary). `binary` is basically syntactic sugar for `nAry(2, fn)`.
Also related is [`unary`](#unary), which constrains to (1) argument.

#### branch
`crocks/Pair/branch`
```haskell
branch :: a -> Pair a a
```
When you want to branch a computation into two parts, this is the function you
want to reach for. All it does is let you pass in any `a` and will return you a
`Pair` that has your value on both the first and second parameter. This allows
you to work on the value in two separate computation paths. Be advised that this
is Javascript and if `a` is an object type (`Object`, `Array`, `Date`, etc) they
will reference each other.

**Pro-Tip**: `Pair` provides a `merge` function that will let you fold the two
values into a single value.

#### compose
`crocks/helpers/compose`
```haskell
compose :: ((y -> z), (x -> y), ..., (a -> b)) -> a -> z
```
While the [`composeB`](#composeb) can be used to create a composition of two
functions, there are times when you want to compose an entire flow together.
That is where `compose` is useful. With `compose` you can create a right-to-left
composition of functions. It will return you a function that represents your
flow. Not really sold on writing flows from right-to-left? Well then, I would
recommend reaching for [`pipe`](#pipe).

#### composeK
`crocks/helpers/composeK`
```haskell
composeK :: Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> a -> m z
```
There are many times that, when working with the various `crocks`, our flows are
just a series of `chain`s. Due to some neat properties with types that provide a
`chain` function, you can remove some boilerplate by reaching for `composeK`.
Just pass it the functions you would normally pass to `chain` and it will do all
the boring hook up for you. Just like `compose`, functions are applied
right-to-left, so you can turn this:

```js
const { chain, compose, isObject, prop, safe } = crocks

const data = {
  do: { re: { mi: 'fa' } }
}

// fluent :: a -> Maybe b
const fluent = x =>
  safe(isObject, x)
    .chain(prop('do'))
    .chain(prop('re'))
    .chain(prop('mi'))

fluent(data)
// => Just 'fa'

// pointfree :: a -> Maybe b
const pointfree = compose(
  chain(prop('mi')),
  chain(prop('re')),
  chain(prop('do')),
  safe(isObject)
)

pointfree(data)
// => Just 'fa'
```

into the more abbreviated form:

```js
const { composeK, isObject, prop, safe } = crocks

const data = {
  do: { re: { mi: 'fa' } }
}

// flow :: a -> Maybe b
const flow = composeK(
  prop('mi'),
  prop('re'),
  prop('do'),
  safe(isObject)
)

flow(data)
// => Just 'fa'
```
As demonstrated in the above example, this function more closely resembles flows
that are using a more pointfree style of coding. As with the other composition
functions in `crocks`, a [`pipeK`](#pipek) function is provided for flows that
make more sense expressed in a left-to-right style.

#### composeP
`crocks/helpers/composeP`
```haskell
composeP :: Promise p => ((y -> p z c), (x -> p y c), ..., (a -> p b c)) -> a -> p z c
```
When working with `Promise`s, it is common place to create chains on a
`Promise`'s `then` function:
```js
const promFunc = x =>
  promiseSomething(x)
    .then(doSomething)
    .then(doAnother)
```

Doing this involves a lot of boilerplate and forces you into a fluent style,
whether you want to be or not. Using `composeP` you have the option to compose a
series of `Promise` returning functions like you would any other function
composition, in a right-to-left fashion. Like so:

```js
const { composeP } = crocks

const promFunc =
  composeP(doAnother, doSomething, promiseSomething)
```
Due to the nature of the `then` function, only the head of your composition
needs to return a `Promise`. This will create a function that takes a value,
which is passed through your chain, returning a `Promise` which can be extended.
This is only a `then` chain, it does not do anything with the `catch` function.
If you would like to provide your functions in a left-to-right manner, check out
[pipeP](#pipep).

#### composeS
`crocks/helpers/composeS`
```haskell
composeS :: Semigroupoid s => (s y z, s x y, ..., s a b) -> s a z
```
When working with things like `Arrow` and `Star` there will come a point when
you would like to compose them like you would any `Function`. That is where
`composeS` comes in handy. Just pass it the `Semigroupoid`s you want to compose
and it will give you back a new `Semigroupoid` of the same type with all of the
underlying functions composed and ready to be run. Like [`compose`](#compose),
`composeS` composes the functions in a right-to-left fashion. If you would like
to represent your flow in a more left-to-right manner, then [`pipeS`](#pipes) is
provided for such things.

```js
const {
  Arrow, bimap, branch, composeS, merge, mreduce, Sum
} = require('crocks')

const length =
  xs => xs.length

const divide =
  (x, y) => x / y

const avg =
  Arrow(bimap(mreduce(Sum), length))
    .promap(branch, merge(divide))

const double =
  Arrow(x => x * 2)

const data =
  [ 34, 198, 3, 43, 92 ]

composeS(double, avg)
  .runWith(data)
// => 148
```

#### curry
`crocks/helpers/curry`
```haskell
curry :: ((a, b, ...) -> z) -> a -> b -> ... -> z
```
Pass this function a function and it will return you a function that can be
called in any form that you require until all arguments have been provided. For
example if you pass a function: `f : (a, b, c) -> d` you get back a function
that can be called in any combination, such as: `f(x, y, z)`, `f(x)(y)(z)`,
`f(x, y)(z)`, or even `f(x)(y, z)`. This is great for doing partial application
on functions for maximum re-usability.

#### defaultProps
`crocks/helpers/defaultProps`
```haskell
defaultProps :: Object -> Object -> Object
```
Picture this, you have an `Object` and you want to make sure that some
properties are set with a given default value. When the need for this type of
operation presents itself, `defaultProps` can come to your aid. Just pass it an
`Object` that defines your defaults and then the `Object` your want to default
those props on. If a key that is present on the defaults `Object` is not defined
on your data, then the default value will be used. Otherwise, the value from
your data will be used instead. You could just apply [`flip`](#flip) to the
[`assign`](#assign) function and get the same result, but having a function
named `defaultProps` may be easier to read in code. As with most `Object`
related functions in `crocks`, `defaultProps` will return you a shallow copy of
the result and not include any `undefined` values in either `Object`.

#### defaultTo
`crocks/helpers/defaultTo`
```haskell
defaultTo :: a -> b -> a
```
With things like `null`, `undefined` and `NaN` showing up all over the place, it
can be hard to keep your expected types inline without resorting to nesting in a
`Maybe` with functions like [`safe`](#safe). If you want to specifically guard
for `null`, `undefined` and `NaN` and get things defaulted into the expected
type, then `defaultTo` should work for you. Just pass it what you would like
your default value to be and then the value you want guarded, and you will get
back either the default or the passed value, depending on if the passed value is
`null`, `undefined` or `NaN`. While this *is* JavaScript and you can return
anything, it is suggested to stick to the signature and only let `a`s through.
As a `b` can be an `a` as well.

#### dissoc
`crocks/helpers/dissoc`
```haskell
dissoc :: String -> Object -> Object
```
While [`assoc`](#assoc) can be used to associate a given key-value pair to a
given `Object`, `dissoc` does the opposite. Just pass `dissoc` a `String` key
and the `Object` you wish to dissociate that key from and you will get back a
new, shallow copy of the `Object` sans your key. As with all the `Object`
functions, `dissoc` will remove any `undefined` values from the result.

#### fanout
`crocks/helpers/fanout`
```haskell
fanout :: (a -> b) -> (a -> c) -> (a -> Pair b c)
fanout :: Arrow a b -> Arrow a c -> Arrow a (Pair b c)
fanout :: Monad m => Star a (m b) -> Star a (m c) -> Star a (m (Pair b c))
```
There are may times that you need to keep some running or persistent state while
performing a given computation. A common way to do this is to take the input to
the computation and branch it into a `Pair` and perform different operations on
each version of the input. This is such a common pattern that it warrants the
`fanout` function to take care of the initial split and mapping. Just provide a
pair of either simple functions or a pair of one of the computation types
(`Arrow` or `Star`). You will get back something of the same type that is
configured to split it's input into a pair and than apply the first Function/ADT
to the first portion of the underlying `Pair` and the second on the second.

#### fromPairs
`crocks/helpers/fromPairs`
```haskell
fromPairs :: [ (Pair String a) ] | List (Pair String a) -> Object
```
As an inverse to [`toPairs`](#topairs), `fromPairs` takes either an `Array` or
`List` of key-value `Pair`s and constructs an `Object` from it. The `Pair` must
contain a `String` in the `fst` and any type of value in the `snd`. The `fst`
will become the key for the value in the `snd`. All primitive values are copied
into the new `Object`, while non-primitives are references to the original. If
you provide an `undefined` values for the second, that `Pair` will not be
represented in the resulting `Object`. Also, when if multiple keys share the
same name, that last value will be moved over.

#### liftA2
#### liftA3
`crocks/helpers/liftA2`
`crocks/helpers/liftA3`
```haskell
liftA2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
liftA3 :: Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d
```
Ever see yourself wanting to `map` a binary or trinary function, but `map` only
allows unary functions? Both of these functions allow you to pass in your
function as well as the number of `Applicatives` (containers that provide both
`of` and `ap` functions) you need to get the mapping you are looking for.

#### mapProps
`crocks/helpers/mapProps`
```haskell
mapProps :: { (* -> *) } -> Object -> Object
```
Would like to map specific keys in an Object with a specific function? Just
bring in `mapProps` and pass it an `Object` with the functions you want to apply
on the keys you want them associated to. When the resulting function receives an
`Object`, it will return a new `Object` with the keys mapped according to the
mapping functions. All keys from the original `Object` that do not exist in
the mapping `Object` will still exist untouched, but the keys with mapping
functions with now contain the result of applying the original value to the
provided mapping function.

`mapProps` also allows for mapping on nested `Object`s for times when the shape
of the original `Object` is know.

```javascript
const mapProps = require('crocks/helpers/mapProps')

const add =
  x => y => x + y

const toUpper =
  x => x.toUpperCase()

const mapping = {
  entry: toUpper,
  fauna: {
    unicorns: add(1),
    elephants: add(-1)
  },
  flora: {
    nariphon: add(10),
    birch: add(1)
  }
}

mapProps(mapping, {
  entry: 'legend',
  fauna: {
    unicorns: 10,
    zombies: 3
  },
  other: {
    hat: 2
  }
})

//=> { entry: 'LEGEND', fauna: { unicorns: 11, zombies: 3 }, other: { hat: 2} }
```

#### mapReduce
`crocks/helpers/mapReduce`
```haskell
mapReduce :: Foldable f => (a -> b) -> (c -> b -> c) -> c -> f a
```
Sometimes you need the power provided by [`mreduceMap`](#mreducemap) but you do
not have a `Monoid` to lift into. `mapReduce` provides the same power, but with
the flexibility of using functions to lift and combine. `mapReduce` takes a
unary mapping function, a binary reduction function, the initial value and
finally a `Foldable` structure of data. Once all arguments are provided,
`mapReduce` folds the provided data, by mapping each value through your mapping
function, before sending it to the second argument of your reduction function.

```javascript
const  Max = require('crocks/Max')
const { Nothing } = require('crocks/Maybe')
const  isNumber = require('crocks/predicates/isNumber')
const  mapReduce = require('crocks/helpers/mapReduce')
const  safeLift = require('crocks/Maybe/safeLift')


const data =
  [ '100', null, 3, true, 1 ]

const safeMax = mapReduce(
  safeLift(isNumber, Max),
  (y, x) => y.concat(x).alt(y).alt(x),
  Nothing()
)

safeMax(data)
  .option(Max.empty())
  .valueOf()
// => 3
```

#### mconcat
#### mreduce
`crocks/helpers/mconcat`
`crocks/helpers/mreduce`
```haskell
mconcat :: Monoid m => m -> ([ a ] | List a) -> m a
mreduce :: Monoid m => m -> ([ a ] | List a) -> a
```
These two functions are very handy for combining an entire `List` or `Array` of
values by providing a [`Monoid`](#monoids) and your collection of values. The
difference between the two is that `mconcat` returns the result inside the
[`Monoid`](#monoids) used to combine them. Where `mreduce` returns the bare
value itself.

#### mconcatMap
#### mreduceMap
`crocks/helpers/mconcatMap`
`crocks/helpers/mreduceMap`
```haskell
mconcatMap :: Monoid m => m -> (b -> a) -> ([ b ] | List b) -> m a
mreduceMap :: Monoid m => m -> (b -> a) -> ([ b ] | List b) -> a
```
There comes a time where the values you have in a `List` or an `Array` are not
in the type that is needed for the [`Monoid`](#monoids) you want to combine
with. These two functions can be used to `map` some transforming function from a
given type into the type needed for the [`Monoid`](#monoids). In essence, this
function will run each value through the function before it lifts the value
into the [`Monoid`](#monoids), before `concat` is applied. The difference
between the two is that `mconcatMap` returns the result inside the
[`Monoid`](#monoids) used to combine them. Where `mreduceMap` returns the bare
value itself.

#### nAry
`crocks/helpers/nAry`
```haskell
nAry :: Number -> (* -> a) -> * -> * -> a
```
When using functions like `Math.max` or `Object.assign` that take as many
arguments as you can throw at them, it makes it hard to `curry` them in a
reasonable manner. `nAry` can make things a little nicer for functions like
that. It can also be put to good use to limit a given function to a desired
number of arguments to avoid accidentally supplying default arguments when you
do not what them applied. First pass `nAry` the number of arguments you wish to
limit the function to and then the function you wish to limit. `nAry` will give
you back a curried function that will only apply the specified number of
arguments to the inner function. Unary and binary functions are so common that
`crocks` provides specific functions for those cases: [`unary`](#unary) and
[`binary`](#binary).

#### objOf
`crocks/helpers/objOf`
```haskell
objOf :: String -> a -> Object
```
If you ever find yourself in a situation where you have a key and a value and
just want to combine the two into an `Object`, then it sounds like `objOf` is
the function for you. Just pass it a `String` for the key and any type of value,
and you'll get back an `Object` that is composed of those two. If you find
yourself constantly concatenating the result of this function into another
`Object`, you may want to use [`assoc`](#assoc) instead.

#### omit
`crocks/helpers/omit`
```haskell
omit :: ([ String ] | List String) -> Object -> Object
```
Sometimes you just want to strip `Object`s of unwanted properties by key. Using
`omit` will help you get that done. Just pass it a `Foldable` structure with a
series of `String`s as keys and then pass it an `Object` and you will get back
not only a shallow copy, but also an `Object` free of any of those pesky
`undefined` values. You can think of `omit` as a way to black-list or reject
`Object` properties based on key names. This function ignores inherited
properties and should only be used with POJOs. If you want to filter or
white-list properties rather than reject them, take a look at [`pick`](#pick).

#### once
`crocks/helpers/once`
```haskell
once :: ((*) -> a) -> ((*) -> a)
```
There are times in Javascript development where you only want to call a function
once and memo-ize the first result for every subsequent call to that function.
Just pass the function you want guarded to `once` and you will get back a
function with the expected guarantees.

#### partial
`crocks/helpers/partial`
```haskell
partial :: ((* -> c), *) -> * -> c
```
There are many times when using functions from non-functional libraries or from
built-in JS functions, where it does not make sense to wrap it in a
[`curry`](#curry). You just want to partially apply some arguments to it and get
back a function ready to take the rest. That is a perfect opportunity to use
`partial`. Just pass a function as the first argument and then apply any other
arguments to it. You will get back a curried function that is ready to accept
the rest of the arguments.

```js
const { map, partial } = require('crocks')

const max10 =
  partial(Math.min, 10)

const data =
  [ 13, 5, 13 ]

map(max10, data)
// => [ 10, 5, 10]
```

#### pick
`crocks/helpers/pick`
```haskell
pick :: ([ String ] | List String) -> Object -> Object
```
When dealing with `Object`s, sometimes it is necessary to only let some of the
key-value pairs on an object through. Think of `pick` as a sort of white-list or
filter for `Object` properties. Pass it a `Foldable` structure of `String`s that
are the keys you would like to pick off of your `Object`. This will give you
back a shallow copy of the key-value pairs you specified. This function will
ignore inherited properties and should only be used with POJOs. Any `undefined`
values will not be copied over, although `null` values are allowed. For
black-listing properties, have a look at [`omit`](#omit).

#### pipe
`crocks/helpers/pipe`
```haskell
pipe :: ((a -> b), (b -> c), ..., (y -> z)) -> a -> z
```
If you find yourself not able to come to terms with doing the typical
right-to-left composition, then `crocks` provides a means to accommodate you.
This function does the same thing as [`compose`](#compose), the only difference
is it allows you define your flows in a left-to-right manner.

#### pipeK
`crocks/helpers/pipeK`
```haskell
pipeK :: Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> a -> m z
```
Like [`composeK`](#composek), you can remove much of the boilerplate when
chaining together a series of functions with the signature:
`Chain m => a -> m b`. The difference between the two functions is, while
[`composeK`](#composek) is right-to-left, `pipeK` is the opposite, taking its
functions left-to-right.

```js
const { curry, List, Writer } = require('../crocks')

const OpWriter =
  Writer(List)

const addLog = curry(
  (x, y) => OpWriter(`adding ${x} to ${y}`, x + y)
)

const scaleLog = curry(
  (x, y) => OpWriter(`scaling ${y} by ${x}`, x * y)
)

const fluent = x =>
  OpWriter.of(x)
    .chain(addLog(4))
    .chain(scaleLog(3))

fluent(0).log()
// => List [ "adding 4 to 0", "scaling 4 by 3" ]

const chainPipe = pipeK(
  addLog(4),
  scaleLog(3)
)

chainPipe(0).log()
// => List [ "adding 4 to 0", "scaling 4 by 3" ]
```

#### pipeP
`crocks/helpers/pipeP`
```haskell
pipeP :: Promise p => ((a -> p b d), (b -> p c d), ..., (y -> p z d)) -> a -> p z d
```
Like the [`composeP`](#composep) function, `pipeP` will let you remove the
standard boilerplate that comes with working with `Promise` chains. The only
difference between `pipeP` and [`composeP`](#composep) is that it takes its
functions in a left-to-right order:

```js
const { pipeP } = crocks

const promFunc = x =>
  promise(x)
    .then(doSomething)
    .then(doAnother)

const promPipe =
  pipeP(proimse, doSomething, doAnother)
```

#### pipeS
`crocks/helpers/pipeS`
```haskell
pipeS :: Semigroupoid s => (s a b, s b c, ..., s y z) -> s a z
```
While `Star`s and `Arrow`s come in very handy at times, the only thing that
could make them better is to compose them . With `pipeS` you can do just that
with any `Semigroupoid`. Just like with [`composeS`](#composes), you just pass
it `Semigroupoid`s of the same type and you will get back another `Semigroupoid`
with them all composed together. The only difference between the two, is that
`pipeS` composes in a left-to-right fashion, while [`composeS`](#composes) does
the opposite.

```js
const {
  curry, isNumber, pipeS, prop, safeLift, Star
} = require('../crocks')

const add = curry(
  (x, y) => x + y
)

const pull =
  x => Star(prop(x))

const safeAdd =
  x => Star(safeLift(isNumber, add(x)))

const data = {
  num: 56,
  string: '56'
}

const flow = (key, num) => pipeS(
  pull(key),
  safeAdd(num)
)

flow('num', 10).runWith(data)
// => Just 66

flow('string', 100).runWith(data)
// => Nothing
```

#### prop
`crocks/Maybe/prop`
```haskell
prop :: (String | Number) -> a -> Maybe b
```
If you want some safety around pulling a value out of an Object or Array with a
single key or index, you can always reach for `prop`. Well, as long as you are
working with non-nested data that is. Just tell `prop` either the key or index
you are interested in, and you will get back a function that will take anything
and return a `Just` with the wrapped value if the key/index exists. If the
key/index does not exist however, you will get back a `Nothing`.

#### propPath
`crocks/Maybe/propPath`
```haskell
propPath :: [ String | Number ] -> a -> Maybe b
```
While [`prop`](#prop) is good for simple, single-level structures, there may
come a time when you have to work with nested POJOs or Arrays. When you run into
this situation, just pull in `propPath` and pass it a left-to-right traversal
path of keys, indices or a combination of both (gross...but possible). This will
kick you back a function that behaves just like [`prop`](#prop). You pass it
some data, and it will attempt to resolve your provided path. If the path is
valid, it will return the value residing there (`null` included!) in a `Just`.
But if at any point that path "breaks" it will give you back a `Nothing`.

#### safe
`crocks/Maybe/safe`
```haskell
safe :: ((a -> Boolean) | Pred) -> a -> Maybe a
```
When using a `Maybe`, it is a common practice to lift into a `Just` or a
`Nothing` depending on a condition on the value to be lifted.  It is so common
that it warrants a function, and that function is called `safe`. Provide a
predicate (a function that returns a Boolean) and a value to be lifted. The
value will be evaluated against the predicate, and will lift it into a `Just` if
true and a `Nothing` if false.

#### safeLift
`crocks/Maybe/safeLift`
```haskell
safeLift :: ((a -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
```
While [`safe`](#safe) is used to lift a value into a `Maybe`, you can reach for
`safeLift` when you want to run a function in the safety of the `Maybe` context.
Just like [`safe`](#safe), you pass it either a `Pred` or a predicate function
to determine if you get a `Just` or a `Nothing`, but then instead of a value,
you pass it a unary function. `safeLift` will then give you back a new function
that will first lift its argument into a `Maybe` and then maps your original
function over the result.

#### tap
`crocks/helpers/tap`
```haskell
tap :: (a -> b) -> a -> a
```
It is hard knowing what is going on inside of some of these ADTs or your
wonderful function compositions. Debugging can get messy when you need to insert
a side-effect into your flow for introspection purposes. With `tap`, you can
intervene in your otherwise pristine flow and make sure that the original value
is passed along to the next step of your flow. This function does not guarantee
immutability for reference types (`Objects`, `Arrays`, etc), you will need to
exercise some discipline here to not mutate.

#### toPairs
`crocks/Pair/toPairs`
```haskell
toPairs :: Object -> List (Pair String a)
```
When dealing with `Object`s, sometimes it makes more sense to work in a
`Foldable` structure like a `List` of key-value `Pair`s. `toPairs` provides a
means to take an object and give you back a `List` of `Pairs` that have a
`String` that represents the key in the `fst` and the value for that key in the
`snd`. The primitive values are copied, while non-primitive values are
references. Like most of the `Object` functions in `crocks`, any keys with
`undefined` values will be omitted from the result. `crocks` provides an inverse
to this function named [`fromPairs`](#frompairs).

#### tryCatch
`crocks/Result/tryCatch`
```haskell
tryCatch :: (a -> b) -> a -> Result e b
```
Typical try-catch blocks are very imperative in their usage. This `tryCatch`
function provides a means of capturing that imperative nature in a simple
declarative style. Pass it a function that could fail and it will return you
another function wrapping the first function. When called, the new function will
either return the result in a `Result.Ok` if everything was good, or an error
wrapped in an `Result.Err` if it fails.

#### unary
`crocks/helpers/unary`
```haskell
unary :: (* -> b) -> a -> b
```
If you every need to lock down a given function to just one argument, then look
no further than `unary`. Just pass it a function of any arity, and you will get
back another function that will only apply (1) argument to given function, no
matter what is passed to it. `unary` is just syntactic sugar around
[`nAry`](#nary) in the form of `nAry(1, fn)` as it is such a common case.
Another common case is [`binary`](#binary) which, as the name implies, only
applies (2) arguments to a given function.

#### unit
`crocks/helpers/unit`
```haskell
unit :: () -> undefined
```
While it seems like just a simple function, `unit` can be used for a number of
things. A common use for it is as a default `noop` as it is a function that does
nothing and returns `undefined`. You can also use it in a pointed fashion to
represent some special value for a given type. This pointed use is the heart and
soul of the infamous `Maybe` type.

### Logic Functions
The functions in this section are used to represent logical branching in a
declarative manner. Each of these functions require either `Pred`s or predicate
functions in their input. Since these functions work with `Pred`s and predicate
functions, rather than values, this allows for composeable, "lazy" evaluation.
All logic functions can be referenced from `crocks/logic`

#### and
```haskell
and :: ((a -> Boolean) | Pred) -> ((a -> Boolean) | Pred) -> a -> Boolean
```
Say you have two predicate functions or `Pred`s and would like to combine them
into one predicate over conjunction, well you came to the right place, `and`
accepts either predicate functions or `Pred`s and will return you a function
ready to take a value. Once that value is passed, it will run it through both of
the predicates and return the result of combining it over a `logical and`. This
is super helpful combined with `or` for putting together reusable, complex
predicates. As they follow the general form of `(a -> Boolean)` they are easily
combined with other logic functions.

#### ifElse
```haskell
ifElse :: ((a -> Boolean) | Pred) -> (* -> a) -> (* -> a) -> * -> a
```
Whenever you need to modify a value based some condition and want a functional
way to do it without some imperative `if` statement, then reach for `ifElse`.
This function take a predicate (some function that returns a Boolean) and two
functions. The first is what is executed when the predicate is true, the second
on a false condition. This will return a function ready to take a value to run
through the predicate. After the value is evaluated, it will be ran through it's
corresponding function, returning the result as the final result. This function
comes in really handy when creating lifting functions for Sum Types (like
`Either` or `Maybe`).

#### not
```haskell
not :: ((a -> Boolean) | Pred) -> a -> Boolean
```
When you need to negate a predicate function or a `Pred`, but want a new
predicate function that does the negation, then `not` is going to get you what
you need. Using `not` will allow you to stay as declarative as possible. Just
pass `not` your predicate function or a `Pred`, and it will give you back a
predicate function ready for insertion into your flow. All predicate based
functions in `crocks` take either a `Pred` or predicate function, so it should
be easy to swap between the two.

#### or
```haskell
or :: ((a -> Boolean) | Pred) -> ((a -> Boolean) | Pred) -> a -> Boolean
```
Say you have two predicate functions or `Pred`s and would like to combine them
into one predicate over disjunction, look no further, `or` accepts either
predicate functions or `Pred`s and will return you a function ready to take a
value. Once that value is passed, it will run it through both of the predicates
and return the result of combining it over a `logical or`. This is super helpful
combined with `and` for putting together reusable, complex predicates. As they
follow the general form of `(a -> Boolean)` they are easily combined with other
logic functions.

#### unless
```haskell
unless :: ((a -> Boolean) | Pred) -> (a -> a) -> a -> a
```
There may come a time when you need to adjust a value when a condition is false,
that is where `unless` can come into play. Just provide a predicate function (a
function that returns a Boolean) and a function to apply your desired
modification. This will get you back a function that when you pass it a value,
it will evaluate it and if false, will run your value through the provided
function. Either the original or modified value will be returned depending on
the result of the predicate. Check out [`when`](#when) for a negated version of
this function.

#### when
```haskell
when :: ((a -> Boolean) | Pred) -> (a -> a) -> a -> a
```
There may come a time when you need to adjust a value when a condition is true,
that is where `when` can come into play. Just provide a predicate function (a
function that returns a Boolean) and a function to apply your desired
modification. This will get you back a function that when you pass it a value,
it will evaluate it and if true, will run your value through the provided
function. Either the original or modified value will be returned depending on
the result of the predicate. Check out [`unless`](#unless) for a negated version
of this function.

### Predicate Functions
All functions in this group have a signature of `* -> Boolean` and are used with
the many predicate based functions that ship with `crocks`, like
[`safe`](#safe), [`ifElse`](#ifelse) and `filter` to name a few. They also fit
naturally with the `Pred` ADT. All predicate functions can be referenced from
`crocks/predicates` Below is a list of all the current predicates that are
included with a description of their truth:

* `hasProp :: (String | Number) -> a -> Boolean`: An Array or Object that contains the provided index or key
* `isAlt :: a -> Boolean`: an ADT that provides `map` and `alt` functions
* `isAlternative :: a -> Boolean`: an ADT that provides `alt`, `zero`, `map`, `ap`, `chain` and `of` functions
* `isApplicative :: a -> Boolean`: an ADT that provides `map`, `ap` and `of` functions
* `isApply :: a -> Boolean`: an ADT that provides `map` and `ap` functions
* `isArray :: a -> Boolean`: Array
* `isBifunctor :: a -> Boolean`: an ADT that provides `map` and `bimap` functions
* `isBoolean :: a -> Boolean`: Boolean
* `isCategory :: a -> Boolean`: an ADT that provides `id` and `compose` functions
* `isChain :: a -> Boolean`: an ADT that provides `map`, `ap` and `chain` functions
* `isContravariant : a -> Boolean`: an ADT that provides `contramap` function
* `isDefined :: a -> Boolean`: Every value that is not `undefined`, `null` included
* `isEmpty :: a -> Boolean`: Empty Object, Array or String
* `isExtend :: a -> Boolean`: an ADT that provides `map` and `extend` functions
* `isFoldable :: a -> Boolean`: Array, List or any structure with a `reduce` function
* `isFunction :: a -> Boolean`: Function
* `isFunctor :: a -> Boolean`: an ADT that provides a `map` function
* `isInteger :: a -> Boolean`: Integer
* `isMonad :: a -> Boolean`: an ADT that provides `map`, `ap`, `chain` and `of` functions
* `isMonoid :: a -> Boolean`: an ADT that provides `concat` and `empty` functions
* `isNil :: a -> Boolean`: `undefined` or `null` or `NaN`
* `isNumber :: a -> Boolean`: `Number` that is not a `NaN` value, `Infinity` included
* `isObject :: a -> Boolean`: Plain Old Javascript Object (POJO)
* `isPlus :: a -> Boolean`: an ADT that provides `map`, `alt` and `zero` functions
* `isProfunctor : a -> Boolean`: an ADT that provides `map`, `contramap` and `promap` functions
* `isPromise :: a -> Boolean`: an object implementing `then` and `catch`
* `isSame :: a -> b -> Boolean`: same value or reference, use `equals` for value equality
* `isSameType :: a -> b -> Boolean`: Constructor matches a values type, or two values types match
* `isSemigroup :: a -> Boolean`: an ADT that provides a `concat` function
* `isSemigroupoid :: a -> Boolean`: an ADT that provides a `compose` function
* `isSetoid :: a -> Boolean`: an ADT that provides an `equals` function
* `isString :: a -> Boolean`: String
* `isTraversable :: a -> Boolean`: an ADT that provides `map` and `traverse` functions

### Point-free Functions
While it can seem natural to work with all these containers in a fluent fashion,
it can get cumbersome and hard to get a lot of reuse out of. A way to really get
the most out of reusability in Javascript is to take what is called a point-free
approach. Below is a small code same to contrast the difference between the two
calling styles:

```javascript
const crocks = require('crocks')

const {
  compose, map, safe, isInteger
} = crocks // map is the point-free function

// isEven :: Integer -> Boolean
const isEven =
  x => (x % 2) === 0

// maybeInt :: a -> Maybe Integer
const maybeInt =
  safe(isInteger)

// fluentIsEven :: a -> Maybe Boolean
const fluentIsEven = data =>
  maybeInt(data)
    .map(isEven)

// pointfreeIsEven :: a -> Maybe Boolean
const pointfreeIsEven =
  compose(map(isEven), maybeInt)
```

These functions provide a very clean way to build out very simple functions and
compose them all together to compose a more complicated flow. Each point-free
function provided in `crocks` is "auto-curried" and follows a "data-last"
pattern in the order of how it receives it's arguments. Typically the most
stable of the arguments comes first, moving all the way to the least stable
argument (which usually is the data flowing through your composition). Below
lists the provided functions and the data types they work with (`m` refers to an
accepted Datatype):

##### Signatures
| Function | Signature | Location |
|---|:---|:---|
| `alt` | `m a -> m a -> m a` | `crocks/pointfree` |
| `ap` | `m a -> m (a -> b) -> m b` | `crocks/pointfree` |
| `bimap` | `(a -> c) -> (b -> d) -> m a b -> m c d` | `crocks/pointfree` |
| `both` | `m (a -> b) -> m (Pair a a -> Pair b b)` | `crocks/pointfree` |
| `chain` | `(a -> m b) -> m a -> m b` | `crocks/pointfree` |
| `coalesce` | `(a -> c) -> (b -> c) -> m a b -> m _ c` | `crocks/pointfree` |
| `concat` | `m a -> m a -> m a` | `crocks/pointfree` |
| `cons` | `a -> m a -> m a` | `crocks/pointfree` |
| `contramap` | `(b -> a) -> m a -> m b` | `crocks/pointfree` |
| `either` | `(a -> c) -> (b -> c) -> m a b -> c` | `crocks/pointfree` |
| `empty` | `m -> m` | `crocks/pointfree` |
| `equals` | `m -> m -> Boolean` | `crocks/pointfree` |
| `evalWith` | `a -> m -> b` | `crocks/State` |
| `execWith` | `a -> m -> b` | `crocks/State` |
| `extend` | `(m a -> b) -> m a -> m b` | `crocks/pointfree` |
| `filter` | <code>((a -> Boolean) &#124; Pred a) -> m a -> m a</code> | `crocks/pointfree` |
| `first` | `m (a -> b) -> m (Pair a c -> Pair b c)` | `crocks/pointfree` |
| `fold` | `Semigroup s => m s -> s` | `crocks/pointfree` |
| `fst` | `m a b -> a` | `crocks/Pair` |
| `head` | `m a -> Maybe a` | `crocks/pointfree` |
| `log` | `m a b -> a` | `crocks/Writer` |
| `map` | `(a -> b) -> m a -> m b` | `crocks/pointfree` |
| `merge` | `(a -> b -> c) -> m a b -> c` | `crocks/Pair` |
| `option` | `a -> m a -> a` | `crocks/pointfree` |
| `promap` | `(c -> a) -> (b -> d) -> m a b -> m c d` | `crocks/pointfree` |
| `read` | `m a b -> Pair a b` | `crocks/Writer` |
| `reduce` | `(b -> a -> b) -> b -> m a -> b` | `crocks/pointfree` |
| `reject` | <code>((a -> Boolean) &#124; Pred a) -> m a -> m a</code> | `crocks/pointfree` |
| `run` | `m a -> b` | `crocks/pointfree` |
| `runWith` | `a -> m -> b` | `crocks/pointfree` |
| `second` | `m (a -> b) -> m (Pair c a -> Pair c b)` | `crocks/pointfree` |
| `sequence` | `Applicative f => (b -> f b) -> m (f a) -> f (m a)` | `crocks/pointfree` |
| `snd` | `m a b -> b` | `crocks/Pair` |
| `swap` | `(c -> d) -> (a -> b) -> m c a -> m b d` | `crocks/pointfree` |
| `tail` | `m a -> Maybe (m a)` | `crocks/pointfree` |
| `traverse` | `Applicative f => (c -> f c) -> (a -> f b) -> m (f a) -> f (m b)` | `crocks/pointfree` |
| `valueOf` | `m a -> a` | `crocks/pointfree` |

##### Datatypes
| Function | Datatypes |
|---|:---|
| `alt` | `Async`, `Either`, `Maybe`, `Result` |
| `ap` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `Result`, `State`, `Unit`, `Writer` |
| `bimap` | `Async`, `Either`, `Pair`, `Result` |
| `both` | `Arrow`, `Function`, `Star` |
| `chain` | `Array`, `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `Result`, `State`, `Unit`, `Writer` |
| `coalesce` | `Async`, `Either`, `Maybe`, `Result` |
| `concat` | `All`, `Any`, `Array`, `Assign`, `Const`, `Either`, `Endo`, `First`, `Identity`, `Last`, `List`, `Max`, `Maybe`, `Min`, `Pair`, `Pred`, `Prod`, `Result`, `String`, `Sum`, `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | `Arrow`, `Pred`, `Star` |
| `either` | `Either`, `Maybe`, `Result` |
| `empty` | `All`, `Any`, `Array`, `Assign`, `Endo`, `First`, `Last`, `List`, `Max`, `Min`, `Object`, `Pred`, `Prod`, `String`, `Sum`, `Unit` |
| `evalWith` | `State` |
| `execWith` | `State` |
| `extend` | `Pair` |
| `filter` | `Array`, `List`, `Object` |
| `first` | `Arrow`, `Function`, `Star` |
| `fold` | `Array`, `List` |
| `fst` | `Pair` |
| `head` | `Array`, `List`, `String` |
| `log` | `Writer` |
| `map` | `Async`, `Array`, `Arrow`, `Const`, `Either`, `Function`, `Identity`, `IO`, `List`, `Maybe`, `Object`, `Pair`, `Reader`, `Result`, `Star`, `State`, `Unit`, `Writer` |
| `merge` | `Pair` |
| `option` | `First`, `Last`, `Maybe` |
| `promap` | `Arrow`, `Star` |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `reject` | `Array`, `List`, `Object` |
| `run` | `IO` |
| `runWith` | `Arrow`, `Endo`, `Pred`, `Reader`, `Star`, `State` |
| `second` | `Arrow`, `Function`, `Star` |
| `sequence` | `Array`, `Either`, `Identity`, `List`, `Maybe`, `Result` |
| `snd` | `Pair` |
| `swap` | `Async`, `Either`, `Pair`, `Result` |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, `Either`, `Identity`, `List`, `Maybe`, `Result` |
| `valueOf` | `All`, `Any`, `Assign`, `Const`, `Endo`, `First`, `Identity`, `Last`, `Max`, `Min`, `Pred`, `Prod`, `Sum`, `Unit`, `Writer` |

### Transformation Functions
Transformation functions are mostly used to reduce unwanted nesting of similar
types. Take for example the following structure:

```javascript
const data =
  Either.of(Maybe.of(3))  // Right Just 3

// mapping on the inner Maybe is tedious at best
data
  .map(map(x => x + 1))   // Right Just 4
  .map(map(x => x * 10))  // Right Just 40

// and extraction...super gross
data
  .either(identity, identity)  // Just 3
  .option(0)                   // 3

// or
data
  .either(option(0), option(0))  // 3
```

The transformation functions, that ship with `crocks`, provide a means for
dealing with this. Using them effectively, can turn the above code into
something more like this:

```javascript
const data =
  Either.of(Maybe.of(3))      // Right Just 3
    .chain(maybeToEither(0))  // Right 3

// mapping on a single Either, much better
data
  .map(x => x + 1)  // Right 4
  .map(x => x * 10) // Right 40

// no need to default the Left case anymore
data
  .either(identity, identity) // 3

// effects of the inner type are applied immediately
const nested =
  Either.of(Maybe.Nothing) // Right Nothing

const unnested =
  nested
    .chain(maybeToEither(0))  // Left 0

// Always maps, although the inner Maybe skips
nested
  .map(map(x => x + 1))        // Right Nothing (runs mapping)
  .map(map(x => x * 10))       // Right Nothing (runs mapping)
  .either(identity, identity)  // Nothing
  .option(0)                   // 0

// Never maps on a Left, just skips it
unnested
  .map(x => x + 1)             // Left 0 (skips mapping)
  .map(x => x * 10)            // Left 0 (skips mapping)
  .either(identity, identity)  // 0
```

Not all types can be transformed to and from each other. Some of them are lazy
and/or asynchronous, or are just too far removed. Also, some transformations
will result in a loss of information. Moving from an `Either` to a `Maybe`, for
instance, would lose the `Left` value of `Either` as a `Maybe`'s first parameter
(`Nothing`) is fixed at `Unit`. Conversely, if you move the other way around,
from a `Maybe` to an `Either` you must provide a default `Left` value. Which
means, if the inner `Maybe` results in a `Nothing`, it will map to `Left` of
your provided value. As such, not all of these functions are guaranteed
isomorphic. With some types you just cannot go back and forth and expect to
retain information.

Each function provides two signatures, one for if a Function is used for the
second argument and another if the source ADT is passed instead. Although it may
seem strange, this provides some flexibility on how to apply the transformation.
The ADT version is great for squishing an already nested type or to perform the
transformation in a composition. While the Function version can be used to
extend an existing function without having to explicitly compose it. Both
versions can be seen here:

```javascript
// Avoid nesting
// inc :: a -> Maybe Number
const inc =
  safeLift(isNumber, x => x + 1)

// using Function signature
// asyncInc :: a -> Async Number Number
const asyncInc =
  maybeToAsync(0, inc)

// using ADT signature to compose (extending functions)
// asyncInc :: a -> Async Number Number
const anotherInc =
  compose(maybeToAsync(0), inc)

// resolveValue :: a -> Async _ a
const resolveValue =
  Async.Resolved

resolveValue(3)                          // Resolved 3
  .chain(asyncInc)                       // Resolved 4
  .chain(anotherInc)                     // Resolved 5
  .chain(compose(maybeToAsync(20), inc)) // Resolved 6

resolveValue('oops')                     // Resolved 'oops'
  .chain(asyncInc)                       // Rejected 0
  .chain(anotherInc)                     // Rejected 0
  .chain(compose(maybeToAsync(20), inc)) // Rejected 0

// Squash existing nesting
// Just Right 'nice'
const good =
  Maybe.of(Either.Right('nice'))

// Just Left 'not so nice'
const bad =
  Maybe.of(Either.Left('not so nice'))

good
  .chain(eitherToMaybe) // Just 'nice'

bad
  .chain(eitherToMaybe) // Nothing
```

#### Transformation Signatures
| Transform | ADT signature | Function Signature | Location |
|---|:---|:---|:---|
| `arrayToList` | `[ a ] -> List a` | `(a -> [ b ]) -> a -> List b` | `crocks/List` |
| `eitherToAsync` | `Either e a -> Async e a` | `(a -> Either e b) -> a -> Async e b` | `crocks/Async` |
| `eitherToFirst` | `Either b a -> First a` | `(a -> Either c b) -> a -> First b` | `crocks/First` |
| `eitherToLast` | `Either b a -> Last a` | `(a -> Either c b) -> a -> Last b` | `crocks/Last` |
| `eitherToMaybe` | `Either b a -> Maybe a` | `(a -> Either c b) -> a -> Maybe b` | `crocks/Maybe` |
| `eitherToResult` | `Either e a -> Result e a` | `(a -> Either e b) -> a -> Result e b` | `crocks/Result` |
| `firstToAsync` | `e -> First a -> Async e a` | `e -> (a -> First b) -> a -> Async e b` | `crocks/Async` |
| `firstToEither` | `c -> First a -> Either c a` | `c -> (a -> First b) -> a -> Either c b` | `crocks/Either` |
| `firstToLast` | `First a -> Last a` | `(a -> First b) -> a -> Last b` | `crocks/Last` |
| `firstToMaybe` | `First a -> Maybe a` | `(a -> First b) -> a -> Maybe b` | `crocks/Maybe` |
| `firstToResult` | `c -> First a -> Result c a` | `c -> (a -> First b) -> a -> Result c b` | `crocks/Result` |
| `lastToAsync` | `e -> Last a -> Async e a` | `e -> (a -> Last b) -> a -> Async e b` | `crocks/Async` |
| `lastToEither` | `c -> Last a -> Either c a` | `c -> (a -> Last b) -> a -> Either c b` | `crocks/Either` |
| `lastToFirst` | `Last a -> First a` | `(a -> Last b) -> a -> First b` | `crocks/First` |
| `lastToMaybe` | `Last a -> Maybe a` | `(a -> Last b) -> a -> Maybe b` | `crocks/Maybe` |
| `lastToResult` | `c -> Last a -> Result c a` | `c -> (a -> Last b) -> a -> Result c b` | `crocks/Result` |
| `listToArray` | `List a -> [ a ]` | `(a -> List b) -> a -> [ b ]` | `crocks/List` |
| `maybeToAsync` | `e -> Maybe a -> Async e a` | `e -> (a -> Maybe b) -> a -> Async e b` | `crocks/Async` |
| `maybeToEither` | `c -> Maybe a -> Either c a` | `c -> (a -> Maybe b) -> a -> Either c b` | `crocks/Either` |
| `maybeToFirst` | `Maybe a -> First a` | `(a -> Maybe b) -> a -> First b` | `crocks/First` |
| `maybeToLast` | `Maybe a -> Last a` | `(a -> Maybe b) -> a -> Last b` | `crocks/Last` |
| `maybeToResult` | `c -> Maybe a -> Result c a` | `c -> (a -> Maybe b) -> a -> Result c b` | `crocks/Result` |
| `resultToAsync` | `Result e a -> Async e a` | `(a -> Result e b) -> a -> Async e b` | `crocks/Async` |
| `resultToEither` | `Result e a -> Either e a` | `(a -> Result e b) -> a -> Either e b` | `crocks/Either` |
| `resultToFirst` | `Result e a -> First a` | `(a -> Result e b) -> a -> First b` | `crocks/First` |
| `resultToLast` | `Result e a -> Last a` | `(a -> Result e b) -> a -> Last b` | `crocks/Last` |
| `resultToMaybe` | `Result e a -> Maybe a` | `(a -> Result e b) -> a -> Maybe b` | `crocks/Maybe` |
| `writerToPair` | `Writer m a -> Pair m a` | `(a -> Writer m b) -> a -> Pair m b` | `crocks/Pair` |
