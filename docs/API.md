crocks.js API
===========

1. [Crocks](#crocks)
    * Arrow
    * Async
    * Const
    * Either
    * [Identity](crocks/Identity.md)
    * IO
    * List
    * Maybe
    * Pair
    * Pred
    * Reader
    * Star
    * State
    * Unit
    * Writer
2. [Monoids](#monoids)
    * All
  	* Any
  	* Assign
  	* Max
  	* Min
  	* Prod
  	* Sum
3. [Combinators](#combinators)
    * [applyTo](#applyTo)
    * [composeB](#composeB)
    * [constant](#constant)
    * [flip](#flip)
    * [identity](#identity)
    * [reverseApply](#reverseApply)
    * [substitution](#substitution)
3. [Helpers](#helpers)
    * [branch](#branch)
    * [compose](#compose)
    * [curry](#curry)
    * [curryN](#curryN)
    * [fanout](#fanout)
    * [ifElse](#ifElse)
    * [liftA](#liftA)
    * [mconcat](#mconcat--amp--mreduce)
    * [mreduce](#mconcat--amp--mreduce)
    * [mconcatMap](#mconcatmap--amp--mreducemap)
    * [mreduceMap](#mconcatmap--amp--mreducemap)
    * [not](#not)
    * [once](#once)
    * [pipe](#pipe)
    * [safe](#safe)
    * [tap](#tap)
    * [tryCatch](#tryCatch)
    * [unless](#unless)
    * [when](#when)
4. [Predicates](#predicates)
5. [Point-free](#point-free)
    * [Signatures](#signatures)
    * [DataTypes](#datatypes)

## Crocks

| Crock | Constructor | Instance |
|---|:---|:---|
| `Arrow` | `empty` | `concat`, `contramap`, `empty`, `first`, `map`, `promap`, `runWith`, `second`, `value` |
| `Async` | `fromPromise`, `of`, `rejected` | `ap`, `bimap`, `chain`, `coalesce`, `fork`, `map`, `of`, `swap`, `toPromise` |
| `Const` | -- | `ap`, `chain`, `concat`, `equals`, `map`, `value` |
| `Either` | `Left`, `Right`, `of`| `ap`, `bimap`, `chain`, `coalesce`, `either`, `equals`, `map`, `of`, `sequence`, `swap`, `traverse`, `value` |
| `Identity` | `of` | `ap`, `chain`, `equals`, `map`, `of`, `sequence`, `traverse`, `value` |
| `IO` | `of` | `ap`, `chain`, `map`, `of`, `run` |
| `List` |  `empty`, `of` | `ap`, `chain`, `concat`, `cons`, `empty`, `equals`, `filter`, `head`, `map`, `of`, `reduce`, `sequence`, `tail`, `traverse`, `value` |
| `Maybe` | `Nothing`, `Just`, `of` | `ap`, `chain`, `coalesce`, `equals`, `either`, `map`, `maybe`, `of`, `option`, `sequence`, `traverse` |
| `Pair` | `of` | `ap`, `bimap`, `chain`, `concat`, `equals`, `fst`, `map`, `merge`, `of`, `snd`, `swap`, `value` |
| `Pred`[*] | `empty` | `concat`, `contramap`, `empty`, `runWith`, `value` |
| `Reader` | `ask`, `of`| `ap`, `chain`, `map`, `of`, `runWith` |
| `Star` | -- | `contramap`, `map`, `promap`, `runWith` |
| `State` | `get`, `gets`, `modify` `of`, `put`| `ap`, `chain`, `evalWith`, `execWith`, `map`, `of`, `runWith` |
| `Unit` | `empty`, `of` | `ap`, `chain`, `concat`, `empty`, `equals`, `map`, `of`, `value` |
| `Writer`| `of` | `ap`, `chain`, `equals`, `log`, `map`, `of`, `read`, `value` |

[*] based on [this article](https://medium.com/@drboolean/monoidal-contravariant-functors-are-actually-useful-1032211045c4#.polugsx2a)


## Monoids

Each `Monoid` provides a means to represent a binary operation and is usually locked down to a specific type. These are great when you need to combine a list of values down to one value. In this library, any ADT that provides both an `empty` and `concat` function can be used as a `Monoid`. There are a few of the `Crocks` that are also monoidial, so be on the look out for those as well. All `Monoids` work with the point-free functions `mconcat`, `mreduce`, `mconcatMap` and `mreduceMap`.

All `Monoids` provide `empty` and `type` function on their Constructors as well as the following Instance Functions: inspect, `type`, `value`, `empty` and `concat`.

| Monoid | Type | Operation | Empty (Identity) |
|---|---|---|---|
| `All` | Boolean | Logical AND | `true` |
| `Any` | Boolean | Logical OR | `false` |
| `Assign` | Object | `Object.assign` | `{}` |
| `Max` | Number | `Math.max` | `-Infinity` |
| `Min` | Number | `Math.min` | `Infinity` |
| `Prod` | Number | Multiplication | `1` |
| `Sum` | Number | Addition | `0` |

## Combinators

### applyTo

#### `applyTo : (a -> b) -> a -> b`
Seems really silly, but is quite useful for a lot of things. It takes a function and a value and then returns the result of that function with the argument applied.

### composeB

#### `composeB : (b -> c) -> (a -> b) -> a -> c`
Provides a means to describe a composition between two functions. it takes two functions and an value. Given `composeB(f, g)`, which is read `f` after `g`, it will return a function that will take value `a` and apply it to `g`, passing the result as an argument to `f`, and will finally return the result of `f`. (This allows only two functions, if you want to avoid things like: `composeB(composeB(f, g), composeB(h, i))` then check out `crocks/helpers/compose`.)

### constant

#### `constant : a -> b -> a`
This is a very handy dandy function, used a lot. Pass it any value and it will give you back a function that will return that same value no matter what you pass it.

### flip

#### `flip : (a -> b -> c) -> b -> a -> c`
This little function just takes a function and returns a function that takes the first two parameters in reverse. One can compose flip calls down the line to flip all, or some of the other parameters if there are more than two. Mix and match to your :heart:'s desire.

### identity

#### `identity :  a -> a`
This function and `constant` are the workhorses of writing code with this library. It quite simply is just a function that when you pass it something, it returns that thing right back to you. So simple, I will leave it as an exercise to reason about why this is so powerful and important.

### reverseApply

#### `reverseApply : a -> (a -> b) -> b`
Ever run into a situation where you have a value but do not have a function to apply it to? Well this little bird, named Thrush, is there to help out. Just give it a value and it will give you back a function ready to take a function. Once that function is provided, it will return the result of applying your value to that function.

### substitution

#### `substitution : (a -> b -> c) -> (a -> b) -> a -> c`
While it a complicated little bugger, it can come in very handy from time to time. In it's first two arguments it takes functions. The first must be binary and the second unary. That will return you a function that is ready to take some value. Once supplied the fun starts, it will pass the `a` to the first argument of both functions, and the result of the second function to the second parameter of the first function. Finally after all that juggling, it will return the result of that first function. When used with partial application on that first parameter, a whole new world of combinatory madness is presented!

## Helpers

### branch

#### `branch : a -> Pair a a`
When you want to branch a computation into two parts, this is the function you want to reach for. All it does is let you pass in any `a` and will return you a `Pair` that has your value on both the first and second parameter. This allows you to work on the value in two separate computation paths. Be advised that this is Javascript and if `a` is an object type (`Object`, `Array`, `Date`, etc) they will reference each other.

**Pro-Tip**: `Pair` provides a `merge` function that will let you fold the two values into a single value.

### compose

#### `compose : ((y -> z), (x -> y), ..., (a -> b)) -> a -> z`
While the `composeB` can be used to create a composition of two functions, there are times when you want to compose an entire flow together. That is where `compose` is useful. With `compose` you can create a right-to-left composition of functions. It will return you a function that represents your flow. Not really sold on writing flows from right-to-left? Well then, I would recommend reaching for `pipe`.

### curry

#### `curry : ((a, b, ...) -> z) -> a -> b -> ... -> z`
Pass this function a function and it will return you a function that can be called in any form that you require until all arguments have been provided. For example if you pass a function: `f : (a, b, c) -> d` you get back a function that can be called in any combination, such as: `f(x, y, z)`, `f(x)(y)(z)`, `f(x, y)(z)`, or even `f(x)(y, z)`. This is great for doing partial application on functions for maximum re-usability.

### curryN

#### `curryN : Number -> ((a, b, ...) -> z) -> a -> b -> ... -> z`
When dealing with variable argument functions, there are times when you may want to curry a specific number of arguments. Just pass this function the number of arguments you want to curry as well as the function, and it will not call the wrapped function until all arguments have been passed. This function will ONLY pass the number of arguments that you specified, any remaining arguments are discarded. This is great for limiting the arity of a given function when additional parameters are defaulted or not needed. This function will not auto curry functions returning functions like `curry` does, use with `curry` if you need to do some fancy setup for your wrapped function's api.

### fanout

#### `fanout : (a -> b) -> (a -> c) -> (a -> Pair b c)`
#### `fanout : Arrow a b -> Arrow a c -> Arrow a (Pair b c)`
#### `fanout : Monad m => Star a (m b) -> Star a (m c) -> Star a (m (Pair b c))`
There are may times that you need to keep some running or persistent state while performing a given computation. A common way to do this is to take the input to the computation and branch it into a `Pair` and perform different operations on each version of the input. This is such a common pattern that it warrents the `fanout` function to take care of the initial split and mapping. Just provide a pair of either simple functions or a pair of one of the computation types (`Arrow` or `Star`). You will get back something of the same type that is configured to split it's input into a pair and than apply the first Function/ADT to the first portion of the underlying `Pair` and the second on the second.

### ifElse

#### `ifElse : ((a -> Boolean) | Pred) -> (a -> b) -> (a -> c) -> a -> b | c`
Whenever you need to modify a value based some condition and want a functional way to do it without some imperative `if` statement, then reach for `ifElse`. This function take a predicate (some function that returns a Boolean) and two functions. The first is what is executed when the predicate is true, the second on a false condition. This will return a function ready to take a value to run through the predicate. After the value is evaluated, it will be ran through it's corresponding function, returning the result as the final result. This function comes in really handy when creating lifting functions for Sum Types (like `Either` or `Maybe`).

### liftA

#### `liftA2 : Applicative m => (a -> b -> c) -> m a -> m b -> m c`
#### `liftA3 : Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d`
Ever see yourself wanting to `map` a binary or tri-ary function, but `map` only allows unary functions? Both of these functions allow you to pass in your function as well as the number of `Applicatives` (containers that provide both `of` and `ap` functions) you need to get the mapping you are looking for.

### mconcat & mreduce

#### `mconcat : Monoid m => m -> ([ a ] | List a) -> m a`
#### `mreduce : Monoid m => m -> ([ a ] | List a) -> a`
These two functions are very handy for combining an entire `List` or `Array` of values by providing a `Monoid` and your collection of values. The difference between the two is that `mconcat` returns the result inside the `Monoid` used to combine them. Where `mreduce` returns the bare value itself.

### mconcatMap & mreduceMap

#### `mconcatMap : Monoid m => m -> (b -> a) -> ([ b ] | List b) -> m a`
#### `mreduceMap : Monoid m => m -> (b -> a) -> ([ b ] | List b) -> a`
There comes a time where the values you have in a `List` or an `Array` are not in the type that is needed for the `Monoid` you want to combine with. These two functions can be used to `map` some transforming function from a given type into the type needed for the `Monoid`. In essence, this function will run each value through the function before it lifts the value into the `Monoid`, before `concat` is applied. The difference between the two is that `mconcatMap` returns the result inside the `Monoid` used to combine them. Where `mreduceMap` returns the bare value itself.

### not

#### `not : ((a -> Boolean) | Pred) -> a -> Boolean`
When you need to negate a predicate function or a `Pred`, but want a new predicate function that does the negation, then `not` is going to get you what you need. Using `not` will allow you to stay as declarative as possible. Just pass `not` your predicate function or a `Pred`, and it will give you back a predicate function ready for insertion into your flow. All predicate based functions in `crocks` take either a `Pred` or predicate function, so it should be easy to swap between the two.

### once

#### `once : ((*) -> a) -> ((*) -> a)`
There are times in Javascript development where you only want to call a function once and memoize the first result for every subsequent call to that function. Just pass the function you want guarded to `once` and you will get back a function with the expected guarantees.

### pipe

#### `pipe : ((a -> b), (b -> c), ..., (y -> z)) -> a -> z`
If you find yourself not able to come to terms with doing the typical right-to-left, then `crocks` provides a means to accommodate you. This function does the same thing as `compose`, the only difference is it allows you define your flows in a left-to-right manner.

### safe

#### `safe : ((a -> Boolean) | Pred) -> a -> Maybe a`
When using a `Maybe`, it is a common practice to lift into a `Just` or a `Nothing` depending on a condition on the value to be lifted.  It is so common that it warrants a function, and that function is called `safe`. Provide a predicate (a function that returns a Boolean) and a value to be lifted. The value will be evaluated against the predicate, and will lift it into a `Just` if true and a `Nothing` if false.

### tap

#### `tap : (a -> b) -> a -> a`
It is hard knowing what is going on inside of some of these ADTs or your wonderful function compositions. Debugging can get messy when you need to insert a side-effect into your flow for introspection purposes. With `tap`, you can intervene in your otherwise pristine flow and make sure that the original value is passed along to the next step of your flow. This function does not guarantee immutability for reference types (Objects, Arrays, etc), you will need to exercise some discipline here to not mutate.

### tryCatch

#### `tryCatch : (a -> b) -> a -> Either e b`
Typical try-catch blocks are very imperative in their usage. This `tryCatch` function provides a means of capturing that imperative nature in a simple declarative style. Pass it a function that could fail and it will return you another function wrapping the first function. When called the new function will either return the result in an `Either.Right` if everything was good, or an error wrapped in an `Either.Left` if it fails.

### unless

#### `unless : ((a -> Boolean) | Pred) -> (a -> b) -> a -> a | b`
There may come a time when you need to adjust a value when a condition is false, that is where `unless` can come into play. Just provide a predicate function (a function that returns a Boolean) and a function to apply your desired modification. This will get you back a function that when you pass it a value, it will evaluate it and if false, will run your value through the provided function. Either the original or modified value will be returned depending on the result of the predicate. Check out `when` for a negated version of this function.

### when

#### `when : ((a -> Boolean) | Pred) -> (a -> b) -> a -> b | a`
There may come a time when you need to adjust a value when a condition is true, that is where `when` can come into play. Just provide a predicate function (a function that returns a Boolean) and a function to apply your desired modification. This will get you back a function that when you pass it a value, it will evaluate it and if true, will run your value through the provided function. Either the original or modified value will be returned depending on the result of the predicate. Check out `unless` for a negated version of this function.

## Predicates

All functions in this group have a signature of `a -> Boolean` and are easily used with the many predicate based functions that ship with `crocks`, like `safe`, `ifElse` and `filter` to name a few. They also fit naturally with the `Pred` ADT. Below is a list of all the current predicates that are included with a description of their truth:

* `isApplicative`: an ADT that provides `map`, `ap` and `of` functions
* `isApply`: an ADT that provides `map` and `ap` functions
* `isArray`: Array
* `isBoolean`: Boolean
* `isEmpty`: Empty Object, Array or String
* `isFunction`: Function
* `isFunctor`: an ADT that provides a `map` function
* `isInteger`: Integer
* `isMonad`: an ADT that provides `map`, `ap`, `chain` and `of` functions
* `isMonoid`: an ADT that provides `concat` and `empty` functions
* `isNil`: undefined or null
* `isNumber`: Number that is not a NaN value, Infinity included
* `isObject`: Plain Old Javascript Object (POJO)
* `isSemigroup`: an ADT that provides a `concat` function
* `isSetoid`: an ADT that provides an `equals` function
* `isString`: String
* `isTraversable`: an ADT that provides `map` and `traverse` functions

## Point-free

While it can seem natural to work with all these containers in a fluent fashion, it can get cumbersome and hard to get a lot of reuse out of. A way to really get the most out of reusability in Javascript is to take what is called a point-free approach. Below is a small code same to contrast the difference between the two calling styles:

```javascript
const crocks = require('crocks')

const { compose, map } = crocks // map is the point-free function

const { Maybe } = crocks
const { Nothing, Just } = Maybe

const isEven =
  x => !(x % 2)

const maybeInt =
  x => !Number.isInteger(x)
    ? Nothing() : Just(x)

function fluentIsEven(data) {
  return maybeInt(data)
    .map(isEven)
}

const pointfreeIsEven =
  compose(map(isEven), maybeInt)
```

These functions provide a very clean way to build out very simple functions and compose them all together to compose a more complicated flow. Each point-free function provided in `crocks` is "auto-curried" and follows a "data-last" pattern in the order of how it receives it's arguments. Typically the most stable of the arguments comes first, moving all the way to the least stable argument (which usually is the data flowing through your composition). Below lists the provided functions and the data types they work with (`m` refers to an accepted Datatype):

### Signatures

| Function | Signature |
|---|:---|
| `ap` | `m a -> m (a -> b) -> m b` |
| `bimap` | `(a -> c) -> (b -> d) -> m a b -> m c d` |
| `chain` | `(a -> m b) -> m a -> m b` |
| `coalesce` | `(a -> b) -> m a b -> m a b` |
| `concat` | `m a -> m a -> m a` |
| `cons` | `a -> m a -> m a` |
| `contramap` | `(b -> a) -> m a -> m b` |
| `either` | `(a -> c) -> (b -> c) -> m a b -> c` |
| `evalWith` | `a -> m -> b` |
| `execWith` | `a -> m -> b` |
| `filter` | `((a -> Boolean) | Pred) -> m a -> m a` |
| `first` | `m (a -> b) -> m ((a, c) -> (b, c))` |
| `fst` | `m a b -> a` |
| `head` | `m a -> Maybe a` |
| `log` | `m a b -> a` |
| `map` | `(a -> b) -> m a -> m b` |
| `maybe` | `a -> m a -> a` |
| `merge` | `(a -> b -> c) -> m a b -> c` |
| `option` | `a -> m a -> a` |
| `promap` | `(c -> a) -> (b -> d) -> m a b -> m c d` |
| `read` | `m a b -> a` |
| `reduce` | `(b -> a -> b) -> b -> m a -> b` |
| `run` | `m a -> b` |
| `runWith` | `a -> m -> b` |
| `second` | `m (a -> b) -> m ((c, a) -> (c, b))` |
| `sequence` | `Applicative f => (b -> f b) -> m (f a) -> f (m a)` |
| `snd` | `m a b -> b` |
| `swap` | `m a b -> m b a` |
| `tail` | `m a -> Maybe (m a)` |
| `traverse` | `Applicative f => (c -> f c) -> (a -> f b) -> m (f a) -> f (m b)` |
| `value` | `m a -> a` |

### Datatypes

| Function | Datatypes |
|---|:---|
| `ap` | `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `State`, `Unit`, `Writer` |
| `bimap` | `Async`, `Either`, `Pair` |
| `chain` | `Async`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `State`, `Unit`, `Writer` |
| `coalesce` | `Async`, `Maybe`, `Either` |
| `concat` | `All`, `Any`, `Array`, `Arrow`, `Assign`, `Const`, `List`, `Max`, `Min`, `Pair`, `Pred`, `Prod`, `Star`, `String`, `Sum`, `Unit` |
| `cons` | `Array`, `List` |
| `contramap` | `Arrow`, `Pred`, `Star` |
| `either` | `Either`, `Maybe` |
| `evalWith` | `State` |
| `execWith` | `State` |
| `filter` | `Array`, `List` |
| `first` | `Arrow`, `Function`, `Star` |
| `fst` | `Pair` |
| `head` | `Array`, `List` |
| `log` | `Writer` |
| `map` | `Async`, `Array`, `Arrow`, `Const`, `Either`, `Function`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `Star`, `State`, `Unit`, `Writer` |
| `maybe` | `Maybe` |
| `merge` | `Pair` |
| `option` | `Either`, `Maybe` |
| `promap` | `Arrow`, `Star` |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `run` | `IO` |
| `runWith` | `Arrow`, `Pred`, `Reader`, `Star`, `State` |
| `second` | `Arrow`, `Function`, `Star` |
| `sequence` | `Array`, `Either`, `Identity`, `List`, `Maybe` |
| `snd` | `Pair` |
| `swap` | `Async`, `Either`, `Pair` |
| `tail` | `Array`, `List`, `String` |
| `traverse` | `Array`, `Either`, `Identity`, `List`, `Maybe` |
| `value` | `Arrow`, `Const`, `Either`, `Identity`, `List`, `Pair`, `Pred`, `Unit`, `Writer` |
