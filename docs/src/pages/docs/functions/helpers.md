---
title: "Helpers"
description: "Helper functions"
layout: "notopic"
functions: ["assign", "assoc", "binary", "compose", "composek", "composep", "composes", "curry", "defaultprops", "defaultto", "dissoc", "frompairs", "lifta2", "lifta3", "liftn", "mapprops", "mapreduce", "mconcat", "mconcatmap", "mreduce", "mreducemap", "nary", "objof", "omit", "once", "partial", "pick", "pipe", "pipek", "pipep", "pipes", "propor", "proppathor", "setpath", "setprop", "tap", "unary", "unit", "unsetpath", "unsetprop"]
weight: 20
---

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


#### binary

`crocks/helpers/binary`
```haskell
binary :: ((*) -> c) -> a -> b -> c
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

#### compose

`crocks/helpers/compose`

```haskell
compose :: ((y -> z), ..., (a -> b)) -> a -> z
```
While the [`composeB`](combinators.html#composeb) can be used to create a
composition of two functions, there are times when you want to compose an entire
flow together. That is where `compose` is useful. With `compose` you can create
a right-to-left composition of functions. It will return you a function that
represents your flow. Not really sold on writing flows from right-to-left? Well
then, I would recommend reaching for [`pipe`](#pipe).

#### composeK

`crocks/helpers/composeK`

```haskell
composeK :: Chain m => ((y -> m z), ..., (a -> m b)) -> a -> m z
```
There are many times that, when working with the various `crocks`, our flows are
just a series of `chain`s. Due to some neat properties with types that provide a
`chain` function, you can remove some boilerplate by reaching for `composeK`.
Just pass it the functions you would normally pass to `chain` and it will do all
the boring hook up for you. Just like `compose`, functions are applied
right-to-left, so you can turn this:

```javascript
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

```javascript
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
composeP :: Promise p => ((y -> p z c), ..., (a -> p b c)) -> a -> p z c
```

When working with `Promise`s, it is common place to create chains on a
`Promise`'s `then` function:

```javascript
const promFunc = x =>
  promiseSomething(x)
    .then(doSomething)
    .then(doAnother)
```

Doing this involves a lot of boilerplate and forces you into a fluent style,
whether you want to be or not. Using `composeP` you have the option to compose a
series of `Promise` returning functions like you would any other function
composition, in a right-to-left fashion. Like so:

```javascript
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
composeS :: Semigroupoid s => (s y z, ..., s a b) -> s a z
```

When working with things like `Arrow` and `Star` there will come a point when
you would like to compose them like you would any `Function`. That is where
`composeS` comes in handy. Just pass it the `Semigroupoid`s you want to compose
and it will give you back a new `Semigroupoid` of the same type with all of the
underlying functions composed and ready to be run. Like [`compose`](#compose),
`composeS` composes the functions in a right-to-left fashion. If you would like
to represent your flow in a more left-to-right manner, then [`pipeS`](#pipes) is
provided for such things.

```javascript
import crocks from 'crocks'

const {
  Arrow, bimap, branch, composeS, merge, mreduce, Sum
} = crocks

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
your data will be used instead. You could just apply
[`flip`](combinators.html#flip) to the [`assign`](#assign) function and get the
same result, but having a function named `defaultProps` may be easier to read in
code. As with most `Object` related functions in `crocks`, `defaultProps` will
return you a shallow copy of the result and not include any `undefined` values
in either `Object`.

#### defaultTo

`crocks/helpers/defaultTo`

```haskell
defaultTo :: a -> b -> a
```

With things like `null`, `undefined` and `NaN` showing up all over the place, it
can be hard to keep your expected types inline without resorting to nesting in a
`Maybe` with functions like [`safe`][safe]. If you want to specifically guard
for `null`, `undefined` and `NaN` and get things defaulted into the expected
type, then `defaultTo` should work for you. Just pass it what you would like
your default value to be and then the value you want guarded, and you will get
back either the default or the passed value, depending on if the passed value is
`null`, `undefined` or `NaN`. While this *is* JavaScript and you can return
anything, it is suggested to stick to the signature and only let `a`s through.
As a `b` can be an `a` as well.

#### fromPairs

`crocks/helpers/fromPairs`

```haskell
fromPairs :: Foldable f => f (Pair String a) -> Object
```

As an inverse to [`toPairs`][topairs], `fromPairs` takes either an `Array` or
`List` of key-value `Pair`s and constructs an `Object` from it. The `Pair` must
contain a `String` in the `fst` and any type of value in the `snd`. The `fst`
will become the key for the value in the `snd`. All primitive values are copied
into the new `Object`, while non-primitives are references to the original. If
you provide an `undefined` values for the second, that `Pair` will not be
represented in the resulting `Object`. Also, when if multiple keys share the
same name, that last value will be moved over.

#### liftA2

`crocks/helpers/liftA2`

```haskell
liftA2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
```

#### liftA3

`crocks/helpers/liftA3`

```haskell
liftA3 :: Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d
```

Ever see yourself wanting to `map` a binary or trinary function, but `map` only
allows unary functions? Both of these functions allow you to pass in your
function as well as the number of `Applicative`s (containers that provide both
`of` and `ap` functions) you need to get the mapping you are looking for.

#### liftN

`crocks/helpers/liftN`

```haskell
liftN :: Applicative m => Number -> ((*) -> a) -> (*m) -> m a
```

While [`liftA2`](#lifta2) and [`liftA3`](#lifta3) will handle a majority of
the functions we tend to encounter, many cases arise when we want to deal with
functions of a greater arity. In those cases, `liftN` will allow the lifting of
function of any size arity.

`liftN` takes a `Number` that specifies the arity of the function to be lifted,
followed by the function itself and finally the required number
of `Applicative` instances of the same type to be applied to the target
function.

In most cases, there is no need to explicitly curry the target function. This
function operates in the same vein as [`nAry`](#nary) and as such manually
curried functions (i.e. `x => y => x + y`) will need to be explicitly curried
using [`curry`](#curry) to ensure proper application of the arguments.

```javascript
import compose from 'crocks/helpers/compose'
import curry from 'crocks/helpers/curry'
import liftN from 'crocks/helpers/liftN'
import isNumber from 'crocks/predicates/isNumber'
import isString from 'crocks/predicates/isString'
import map from 'crocks/pointfree/map'
import safe from 'crocks/Maybe/safe'

// apply :: (((*) -> b), [ a ]) -> b
const apply = fn => xs =>
  fn.apply(null, xs)

// join :: String -> String -> String
const join =
  x => y => `${x} ${y}`

// safeString :: a -> Maybe String
const safeString =
  safe(isString)

// sumArgs :: (* Number) -> Number
const sumArgs =
  (...args) => args.reduce((x, y) => x + y, 0)

// max :: Applicative m => [ m Number ] -> m Number
const max =
  apply(liftN(4, Math.max))

// sum :: Applicative m => [ m Number ] -> m Number
const sum =
  apply(liftN(4, sumArgs))

// apJoin :: Applicative m => [ m String ] -> m String
const apJoin =
  liftN(2, curry(join))

// good :: [ Number ]
const good =
  [ 45, 54, 96, 99 ]

// bad :: [ String ]
const bad =
  [ 'one', 'two', 'three', 'four' ]

// arMax :: [ Number ] -> [ Number ]
const arMax =
  compose(max, map(Array.of))

// safeSum :: Maybe Number -> Maybe Number
const safeSum =
  compose(sum, map(safe(isNumber)))

arMax(good)
//=> [ 99 ]

safeSum(good)
//=> Just 294

safeSum(bad)
//=> Nothing

apJoin(safeString('Joey'), safeString('Fella'))
//=> Just "Joey Fella"

apJoin(safeString(9), safeString('Fella'))
//=> Nothing
```

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
import mapProps from 'crocks/helpers/mapProps'

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
mapReduce :: Foldable f => (a -> b) -> (c -> b -> c) -> c -> f a -> c
```

Sometimes you need the power provided by [`mreduceMap`](#mreducemap) but you do
not have a `Monoid` to lift into. `mapReduce` provides the same power, but with
the flexibility of using functions to lift and combine. `mapReduce` takes a
unary mapping function, a binary reduction function, the initial value and
finally a `Foldable` structure of data. Once all arguments are provided,
`mapReduce` folds the provided data, by mapping each value through your mapping
function, before sending it to the second argument of your reduction function.

```javascript
import Max from 'crocks/Max'
import Maybe from 'crocks/Maybe'
import isNumber from 'crocks/predicates/isNumber'
import mapReduce from 'crocks/helpers/mapReduce'
import safeLift from 'crocks/Maybe/safeLift'

const { Nothing } = Maybe

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

`crocks/helpers/mconcat`

```haskell
mconcat :: Monoid m, Foldable f => m -> f a -> m a
```

#### mreduce

`crocks/helpers/mreduce`

```haskell
mreduce :: Monoid m, Foldable f => m -> f a -> a
```

These two functions are very handy for combining an entire `List` or `Array` of
values by providing a [`Monoid`](../monoids/index.html) and your collection of
values. The difference between the two is that `mconcat` returns the result
inside the [`Monoid`](../monoids/index.html) used to combine them. Where
`mreduce` returns the bare value itself.

#### mconcatMap

`crocks/helpers/mconcatMap`

```haskell
mconcatMap :: Monoid m, Foldable f => m -> (b -> a) -> f b -> m a
```

#### mreduceMap

`crocks/helpers/mreduceMap`

```haskell
mreduceMap :: Monoid m, Foldable f => m -> (b -> a) -> f b -> a
```

There comes a time where the values you have in a `List` or an `Array` are not
in the type that is needed for the [`Monoid`](../monoids/index.html) you want to
combine with. These two functions can be used to `map` some transforming
function from a given type into the type needed for the
[`Monoid`](../monoids/index.html). In essence, this function will run each value
through the function before it lifts the value into the
[`Monoid`](../monoids/index.html), before `concat` is applied. The difference
between the two is that `mconcatMap` returns the result inside the
[`Monoid`](../monoids/index.html) used to combine them. Where `mreduceMap`
returns the bare value itself.

#### nAry

`crocks/helpers/nAry`

```haskell
nAry :: Number -> ((*) -> a) -> (*) -> a
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
omit :: Foldable f => f String -> Object -> Object
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
partial :: (((*) -> c), *) -> (*) -> c
```

There are many times when using functions from non-functional libraries or from
built-in JS functions, where it does not make sense to wrap it in a
[`curry`](#curry). You just want to partially apply some arguments to it and get
back a function ready to take the rest. That is a perfect opportunity to use
`partial`. Just pass a function as the first argument and then apply any other
arguments to it. You will get back a curried function that is ready to accept
the rest of the arguments.

```javascript
import crocks from 'crocks'

const { map, partial } = crocks

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
pick :: Foldable f => f String -> Object -> Object
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
pipe :: ((a -> b), ..., (y -> z)) -> a -> z
```

If you find yourself not able to come to terms with doing the typical
right-to-left composition, then `crocks` provides a means to accommodate you.
This function does the same thing as [`compose`](#compose), the only difference
is it allows you define your flows in a left-to-right manner.

#### pipeK

`crocks/helpers/pipeK`

```haskell
pipeK :: Chain m => ((a -> m b), ..., (y -> m z)) -> a -> m z
```

Like [`composeK`](#composek), you can remove much of the boilerplate when
chaining together a series of functions with the signature:
`Chain m => a -> m b`. The difference between the two functions is, while
[`composeK`](#composek) is right-to-left, `pipeK` is the opposite, taking its
functions left-to-right.

```javascript
import crocks from 'crocks'

const { curry, List, Writer } = crocks

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
pipeP :: Promise p => ((a -> p b d), ..., (y -> p z d)) -> a -> p z d
```

Like the [`composeP`](#composep) function, `pipeP` will let you remove the
standard boilerplate that comes with working with `Promise` chains. The only
difference between `pipeP` and [`composeP`](#composep) is that it takes its
functions in a left-to-right order:

```javascript
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
pipeS :: Semigroupoid s => (s a b, ..., s y z) -> s a z
```

While `Star`s and `Arrow`s come in very handy at times, the only thing that
could make them better is to compose them . With `pipeS` you can do just that
with any `Semigroupoid`. Just like with [`composeS`](#composes), you just pass
it `Semigroupoid`s of the same type and you will get back another `Semigroupoid`
with them all composed together. The only difference between the two, is that
`pipeS` composes in a left-to-right fashion, while [`composeS`](#composes) does
the opposite.

```javascript
import {
  curry, isNumber, pipeS, prop, safeLift, Star
} from 'crocks'

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

#### propOr

`crocks/helpers/propOr`

```haskell
propOr :: a -> (String | Integer) -> b -> c
```

If you want some safety around pulling a value out of an Object or Array with a
single key or index, you can always reach for `propOr`. Well, as long as you are
working with non-nested data that is. Just tell `propOr` either the key or index
you are interested in, and you will get back a function that will take anything
and return the wrapped value if the key/index is defined. If the key/index is not
defined however, you will get back the provided default value.

```javascript
import propOr from 'crocks/helpers/propOr'

const data = {
  foo: 'bar',
  null: null,
  nan: NaN,
  undef: undefined
}

// def :: (String | Integer) -> a -> b
const def =
  propOr('default')

def('foo', data)
//=> "bar"

def('null', data)
//=> null

def('nan', data)
//=> NaN

def('baz', data)
//=> "default"

def('undef', data)
//=> "default"
```

#### propPathOr

`crocks/helpers/propPathOr`

```haskell
propPathOr :: Foldable f => a -> f (String | Integer) -> b -> c
```

While [`propOr`](#propor) is good for simple, single-level structures, there may
come a time when you have to work with nested POJOs or Arrays. When you run into
this situation, just pull in `propPathOr` and pass it a left-to-right traversal
path of keys, indices or a combination of both (gross...but possible). This will
kick you back a function that behaves just like [`propOr`](#propor). You pass it
some data, and it will attempt to resolve your provided path. If the path is
valid, it will return the value. But if at any point that path "breaks" it will
give you back the default value.

```javascript
import propPathOr from 'crocks/helpers/propPathOr'

const data = {
  foo: {
    bar: 'bar',
    null: null,
    nan: NaN,
    undef: undefined
  },
  arr: [ 1, 2 ]
}

// def :: [ String | Integer ] -> a -> b
const def =
  propPathOr('default')

def([ 'foo', 'bar' ], data)
//=> "bar"

def([ 'baz', 'tommy' ], data)
//=> "default"

def([ 'foo', 'null' ], data)
//=> null

def([ 'foo', 'nan' ], data)
//=> NaN

def([ 'foo', 'undef' ], data)
//=> "default"

def([ 'arr', 'length' ], data)
//=> 2
```

#### setPath

`crocks/helpers/setPath`

```haskell
setPath :: [ (String | Integer) ] -> a -> (Object | Array) -> (Object | Array)
```

Used to set a value on a deeply nested `Object`, `setPath` will traverse down
a path and set the a the final property to the provided value. `setPath` returns
the an `Object`/`Array` with the modification and does not alter the original
`Object`/`Array` along the path.

The provided path can be a mixture of either `Integer`s or `String`s to allow
for traversing through both `Array`s and `Object`s. When an `Integer` zero or
greater is provided it will treat that portion as an `Array` while `String`s are
used to reference through `Object`s. If at any point in the provided
a `NaN`, `undefined` or `null` values is encountered, a
new `Object`/`Array` will be created.

```javascript
import setPath from 'crocks/helpers/setPath'

setPath([ 'account', 'name' ], 'Awesome Place', {
  account: {
    name: 'Great Place',
    rating: 5
  }
})
//=> { account: { name: 'Awesome Place', rating: 5 } }

setPath([ 'people', 2, 'age' ], 26, {
  people: [
    { name: 'George', age: 22 },
    { name: 'Greta', age: 21 },
    { name: 'Ali', age: 25 }
  ]
})
//=> { people: [
//   { name: 'George', age: 22 },
//   { name: 'Greta', age: 21 },
//   { name: 'Ali', age: 26 },
// ] }

setPath([ 'a', 'c' ], false, { a: { b: true } })
// => { a: { b: true, c: false } }

setPath([ 'list', 'a' ], 'ohhh, I see.', { list: [ 'string', 'another' ] })
//=> { list: { 0: 'string', 1: 'another', a: 'ohhh, I see.' } }
```

#### setProp

`crocks/helpers/setProp`

```haskell
setProp ::  (String | Integer) -> a -> (Object | Array) -> (Object | Array)
```

Used to set a given value for a specific key or index of
an `Object` or `Array`. `setProp` takes either a `String` or `Integer` value
as its first argument and a value of any type as its second. The third parameter
is dependent of the type of the first argument. When a `String` is provided, the
third argument must be an `Object`. Otherwise if the first argument is
an `Integer` zero or greater, then the third must be an `Array`.

`setProp` will return a new instance of either `Object` or `Array` with the
addition applied. When the value exists on the provided object, then the value
will overwritten. If the value does not exist then it will be added to the
resulting structure. In the case of `Array`, the value will be added to the
provided index, leaving `undefined` values, resulting in a sparse `Array`.

```javascript
import setProp from 'crocks/helpers/setProp'

setProp('a', false, { a: true })
//=> { a: false }

setProp('b', 43, { a: true })
//=> { a: true, b: 43 }

setProp(0, 'string', [ 'a' ])
//=> [ "string" ]

setProp(1, 'b', [ 'a' ])
//=> [ "a", "b" ]

setProp(2, 'c', [ 'a' ])
//=> [ "a", undefined, "c" ]
```

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

#### tryCatch

`crocks/Result/tryCatch`

```haskell
tryCatch :: ((*) -> b) -> (*) -> Result e b
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
unary :: ((*) -> b) -> a -> b
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
soul of the infamous [`Maybe`][maybe] type.

#### unsetPath

`crocks/helpers/unsetPath`

```haskell
unsetPath :: [ (String | Integer) ] -> a -> a
```

Used to remove a property or index on a deeply nested `Object`/`Array`.
`unsetPath` is will return a new instance with the property or index removed.

The provided path can be a mixture of either Positive `Integer`s or `String`s to
allow for traversing through both `Array`s and `Object`s. When an `Integer` is
provided it will treat that portion as an `Array` while `String`s are used to
reference through `Object`s.

```javascript
import unsetPath from 'crocks/helpers/unsetPath'

unsetPath([ 'people', 0, 'remove' ], {
  people: [
    { name: 'Tonya', remove: true },
    { name: 'Bobby' },
  ]
})
//=> { people: [ { name: 'Tonya' }, { name: 'Bobby' } ] }

unsetPath([ 'a', 'c', 'd' ], { a: null })
//=> { a: null }

unsetPath([ 'a', 'b' ], { a: { b: false } })
//=> { a: {} }

unsetPath([ 'a', 'b' ], { a: { c: false } })
//=> { a: { c: false } }
```

#### unsetProp

`crocks/helpers/unsetProp`

```haskell
unsetProp :: (String | Integer) -> a -> a
```

`unsetProp` is a binary function that takes either a property name or an index
as its first argument. Which specifies what should be removed, or "unset", from
the `Object` or `Array` provided as the second argument. If the value provided
for the second argument is not an `Object` or `Array`, then the value provided
is echoed back as the result.

The first argument must be either a non-empty `String` or
positive `Integer`. A `String` should be provided when working with
an `Object`, while `Array`s require an `Integer`. `unsetProp` will return a new
instance of either the `Object` or `Array`, sans the key or index.

```javascript
import unsetProp from '/crocks/helpers/unsetProp'

unsetProp('temp', { name: 'Joey', temp: 33 })
//=> { name: 'Joey' }

unsetProp(1, [ 33, 22, 99 ])
//=> [ 33, 99 ]

unsetProp('d', { a: 'A', b: 'B' })
//=> { a: 'A', b: 'B' }

unsetProp(10, [ 'a', 'b', 'c' ])
//=> [ 'a', 'b', 'c' ]

unsetProp('silly', null)
//=> null
```

[maybe]: ../crocks/Maybe.html
[safe]: ../crocks/Maybe.html#safe
[topairs]: ../crocks/Pair.html#topairs
