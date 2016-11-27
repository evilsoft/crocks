# crocks.js
`crocks` is a collection of popular *Algebraic Data Types (ADTs)* that are all the rage in functional programming. You have heard of things like `Maybe` and `Either` and heck maybe even `IO`, that is what these are. The main goal of `crocks` is to curate and provide not only a common interface between each type (where possible of course), but also all of the helper functions needed to hit the ground running.

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need to do is run the following to save it as a dependency in your current project folder:

```
$ npm install crocks -S
```

This will pull down `crocks` into your project's `node_modules` folder and can be accessed by adding something like the following in the file that needs it:

```javascript
// node require syntax
const crocks = require('crocks')

// Javascript modules (if you are transpiling or using rollup.js)
import crocks from 'crocks'
```

There is no compilation going on here, so as a result, you will need to bundle or run with node `4.x` or higher. This lib *should* work, with no additional compilation in all current browsers (Edge, Safari, Chrome, Firefox), if it does not, please file an issue as I really, really want it to. :smile_cat:.

Another thing to note is, if you are transpiling, then destructuring in your `import` statement is not going to work as you are thinking (maybe if you are using `babel`, but this will be broken once modules are available in node, so be careful). Basically you should not do this, as `crocks` will not be set up for it until modules are available in node:

```javascript
// Nope! Nope! Nope!:
import { Maybe, compose, curry, map } from 'crocks'

// instead do something like this:
import crocks from 'crocks'
const { Maybe, compose, curry, map } = crocks

// do not wanna bring all of crocks into your bundle?
// I feel ya, try this:

import Maybe from 'crocks/crocks/Maybe'
import compose from 'crocks/funcs/compose'
import curry from 'crocks/funcs/curry'
import map from 'crocks/pointfree/map'

// you can of course do the same with require statements:
const Maybe = require('crocks/crocks/Maybe')
...
```

## What is in this?
There are (5) classifications of "things" included in this library:

* Crocks (`crocks/crocks`): These are the ADTs that this library is centered around. They are all Functor based Data Types that provide different computational contexts for working in a more declarative, functional flow. For the most part, a majority of the other bits in `crocks` exist to server these ADTs.

* Monoids (`crocks/monoids`): These helpful ADTs are in a class of their own, not really Functors in their own right (although some can be), they are still very useful in our everyday programming needs. Ever need to Sum a list of Numbers or mix a mess of objects together? This is were you will find the ADTs you need to do that.

* Combinators (`crocks/combinators`): A collection of functions that are used for working with other functions. These do things like compose (2) functions together, or flip arguments on a function. They typically either take a function, return a function or a bit a both. These are considered the glue that holds the mighty house of `Crocks` together and a valuable aid in writing reusable code.

* Helper Functions (`crocks/funcs`): All other support functions that are either convenient versions of combinators or not even combinators at all cover this group.

* Point-free Functions (`crocks/pointfree`): Wanna use these ADTs in a way that you never have to reference the actual data being worked on? Well here is where you will find all of these functions to do that. For every algebra available on both the `Crocks` and `Monoids` there is a function here.

### Crocks
The `Crocks` are the heart and soul of this library. This is where you will find all your favorite ADT's you have grown to :heart:. They include gems such as: `Maybe`, `Either` and `IO`, to name a few. The are usually just a simple constructor that takes either a function or value (depending on the type) and will return you a "container" that wraps whatever you passed it. Each container provides a variety of functions that act as the operations you can do on the contained value. There are many types that share the same function names, but what they do from type to type may vary. Every `Crock` provides `type` function on the Constructor and both `inspect` and `type` functions on their Instances.

All `Crocks` are Constructor functions of the given type, with `Writer` being an exception. The `Writer` function takes a `Monoid` that will represent the `log`. Once you provide the `Monoid`, the function will return the `Writer` Constructor for your `Writer` for that specific `Monoid`.

| Crock | Constructor | Instance |
|---|---|---|
| `Arrow` | `empty` | `value`, `runWith`, `concat`, `empty`, `map`, `contramap`, `promap`, `first`, `second` |
| `Const` | -- | `equals`, `value`, `concat`, `map`, `ap`, `chain` |
| `Either` | `Left`, `Right`, `of`| `equals`, `value`, `either`, `swap`, `coalesce`, `map`, `bimap`, `ap`, `of`, `chain`, `sequence`, `traverse` |
| `Identity` | `of` | `equals`, `value`, `map`, `ap`, `of`, `chain`, `sequence`, `traverse` |
| `IO` | `of` | `run`, `map`, `ap`, `of`, `chain` |
| `List` |  `empty`, `of` | `equals`, `value`, `head`, `tail`, `cons`, `concat`, `empty`, `reduce`, `filter`, `map`, `ap`, `of`, `chain`, `sequence`, `traverse` |
| `Maybe` | `Nothing`, `Just`, `of` | `equals`, `maybe`, `either`, `option`, `coalesce`, `map`, `ap`, `of`, `chain`, `sequence`, `traverse` |
| `Pair` | `of` | `equals`, `value`, `fst`, `snd`, `merge`, `concat`, `swap`, `map`, `bimap`, `ap`, `of`, `chain` |
| `Reader` | `ask`, `of`| `runWith`, `map`, `ap`, `of`, `chain` |
| `State` | `get`, `gets`, `put`, `modify` `of`| `runWith`, `execWith`, `evalWith`, `map`, `ap`, `of`, `chain` |
| `Unit` | `empty`, `of` | `equals`, `value`, `concat`, `empty`, `map`, `ap`, `of`, `chain` |
| `Writer`| `of` | `equals`, `value`, `log`, `read`, `map`, `ap`, `of`, `chain` |

### Monoids
Each `Monoid` provides a means to represent a binary operation and is usually locked down to a specific type. These are great when you need to combine a list of values down to one value. In this library, any ADT that provides both an `empty` and `concat` function can be used as a `Monoid`. There are a few of the `Crocks` that are also monoidial, so be on the look out for those as well. All `Monoids` work with the point-free functions `mconcat`, `mreduce`, `mconcatMap` and `mreduceMap`.

All `Monoids` provide `empty` and `type` function on their Constructors as well as the following Instance Functions: `inspect`, `type`, `value`, `empty` and `concat`.


| Monoid | Type | Operation | Empty (Identity) |
|---|---|---|---|
| `All` | Boolean | Logical AND | `true` |
| `Any` | Boolean | Logical OR | `false` |
| `Assign` | Object | `Object.assign` | `{}` |
| `Max` | Number | `Math.max` | `-Infinity` |
| `Min` | Number | `Math.min` | `Infinity` |
| `Prod` | Number | Multiplication | `1` |
| `Sum` | Number | Addition | `0` |

### Combinators
#### `applyTo : (a -> b) -> a -> b`
Seems really silly, but is quite useful for a lot of things. It takes a function and a value and then returns the result of that function with the argument applied.

#### `composeB : (b -> c) -> (a -> b) -> a -> c`
Provides a means to describe a composition between two functions. it takes two functions and an value. Given `composeB(f, g)`, which is read `f` after `g`, it will return a function that will take value `a` and apply it to `g`, passing the result as an argument to `f`, and will finally return the result of `f`. (This allows only two functions, if you want to avoid things like: `composeB(composeB(f, g), composeB(h, i))` then check out `crocks/funcs/compose`.)

#### `constant : a -> b -> a`
This is a very handy dandy function, used a lot. Pass it any value and it will give you back a function that will return that same value no matter what you pass it.

#### `flip : (a -> b -> c) -> b -> a -> c`
This little function just takes a function and returns a function that takes the first two parameters in reverse. Once can compose flip calls down the line to flip all, or some of the other parameters if there are more than two. Mix and match to your :heart:s desire.

#### `identity :  a -> a`
This function and `constant` are the workhorses of writing code with this library. It quite simply is just a function that when you pass it something, it returns that thing right back to you. So simple, I will leave it as an exercise to reason about why this is so powerful and important.

#### `reverseApply : a -> (a -> b) -> b`
Ever run into a situation where you have a value but do not have a function to apply it to? Well this little bird, named Thrush, is there to help out. Just give it a value and it will give you back a function ready to take a function. Once that function is provided, it will return the result of applying your value to that function.

#### `substitution : (a -> b -> c) -> (a -> b) -> a -> c`
While it a complicated little bugger, it can come in very handy from time to time. In it's first two arguments it takes functions. The first must be binary and the second unary. That will return you a function that is ready to take some value. Once supplied the fun starts, it will pass the `a` to the first argument of both functions, and the result of the second function to the second parameter of the first function. Finally after all that juggling, it will return the result of that first function. When used with partial application on that first parameter, a whole new world of combinatory madness is presented!

### Helper Functions
#### `branch : a -> Pair a a`
When you want to branch a computation into two parts, this is the function you want to reach for. All it does is let you pass in any `a` and will return you a `Pair` that has your value on both the first and second parameter. This allows you to work on the value in two separate computation paths. Be advised that this is Javascript and if `a` is an object type (`Object`, `Array`, `Date`, etc) they will reference each other.

**Pro-Tip**: `Pair` provides a `merge` function that will let you fold the two values into a single value.

#### `compose : ((y -> z), (x -> y), ..., (a -> b)) -> a -> z`
While the `composeB` can be used to create a composition of two functions, there are times when you want to compose an entire flow together. That is where `compose` is useful. With `compose` you can create a right-to-left composition of functions. It will return you a function that represents your flow. Not really sold on writing flows from right-to-left? Well then, I would recommend reaching for `pipe`.

#### `curry : ((a, b, c) -> d) -> a -> b -> c -> d`
Pass this function a function and it will return you a function that can be called in any form that you require until all arguments have been provided. For example if you pass a function: `f : (a, b, c) -> d` you get back a function that can be called in any combination, such as: `f(x, y, z)`, `f(x)(y)(z)`, `f(x, y)(z)`, or even `f(x)(y, z)`. This is great for doing partial application on functions for maximum reusability.

#### `ifElse : (a -> Boolean) -> (a -> b) -> (a -> c) -> a -> b | c`
Whenever you need to modify a value based some condition and want a functional way to do it without some imperative `if` statement, then reach for `ifElse`. This function take a predicate (some function that returns a Boolean) and two functions. The first is what is executed when the predicate is true, the second on a false condition. This will return a function ready to take a value to run through the predicate. After the value is evaluated, it will be ran through it's corresponding function, returning the result as the final result. This function comes in really handy when creating lifting functions for Sum Types (like `Either` or `Maybe`).

#### `inspect : a -> String`
The containers are not very easy to peek into as a result of them locking down their wrapped values. `inspect` is just a simple function that takes some data and returns a nice formatted `String` that will provide the type of container and the wrapped value (when possible).

#### `liftA2 : Applicative m => (a -> b -> c) -> m a -> m b -> m c`
#### `liftA3 : Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d`
Ever see yourself wanting to `map` a binary or tri-ary function, but `map` only allows unary functions? Both of these functions allow you to pass in your function as well as the number of `Applicatives` (containers that provide both `of` and `ap` functions) you need to get the mapping you are looking for.

#### `mconcat : Monoid m => m -> ([ a ] | List a) -> m a`
#### `mreduce : Monoid m => m -> ([ a ] | List a) -> a`
These two functions are very handy for combining an entire `List` or `Array` of values by providing a `Monoid` and your collection of values. The difference between the two is that `mconcat` returns the result inside the `Monoid` used to combine them. Where `mreduce` returns the bare value itself.

#### `mconcatMap : Monoid m => m -> (b -> a) -> ([ b ] | List b) -> m a`
#### `mreduceMap : Monoid m => m -> (b -> a) -> ([ b ] | List b) -> a`
There comes a time where the values you have in a `List` or an `Array` are not in the type that is needed for the `Monoid` you want to combine with. These two functions can be used to `map` some transforming function from a given type into the type needed for the `Monoid`. In essence, this function will run each value through the function before it lifts the value into the `Monoid`, before `concat` is applied. The difference between the two is that `mconcatMap` returns the result inside the `Monoid` used to combine them. Where `mreduceMap` returns the bare value itself.

#### `pipe : ((a -> b), (b -> c), ..., (y -> z)) -> a -> z`
If you find yourself not able to come to terms with doing the typical right-to-left, then `crocks` provides a means to accommodate you. This function does the same thing as `compose`, the only difference is it allows you define your flows in a left-to-right manner.

#### `safe : (a -> Boolean) -> a -> Maybe a`
When using a `Maybe`, it is a common practice to lift into a `Just` or a `Nothing` depending on a condition on the value to be lifted.  It is so common that it warrants a function, and that function is called `safe`. Provide a predicate (a function that returns a Boolean) and a value to be lifted. The value will be evaluated against the predicate, and will lift it into a `Just` if true and a `Nothing` if false.


#### `unless : (a -> Boolean) -> (a -> b) -> a -> a | b`
There may come a time when you need to adjust a value when a condition is false, that is where `unless` can come into play. Just provide a predicate function (a function that returns a Boolean) and a function to apply your desired modification. This will get you back a function that when you pass it a value, it will evaluate it and if false, will run your value through the provided function. Either the original or modified value will be returned depending on the result of the predicate. Check out `when` for a negated version of this function.

#### `when : (a -> Boolean) -> (a -> b) -> a -> b | a`
There may come a time when you need to adjust a value when a condition is true, that is where `when` can come into play. Just provide a predicate function (a function that returns a Boolean) and a function to apply your desired modification. This will get you back a function that when you pass it a value, it will evaluate it and if true, will run your value through the provided function. Either the original or modified value will be returned depending on the result of the predicate. Check out `unless` for a negated version of this function.

#### Point-free Functions
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

##### Signatures
| Function | Signature |
|---|---|
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
| `filter` | `(a -> Boolean) -> m a -> m a` |
| `first` | `(a -> b) -> m (a, c) -> m (b, c)` |
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
| `second` | `(b -> c) -> m (a, b) -> m (a, c)` |
| `sequence` | `Apply f => (b -> f b) -> m (f a) -> f (m a)` |
| `snd` | `m a b -> b` |
| `swap` | `m a b -> m b a` |
| `tail` | `m a -> Maybe (m a)` |
| `traverse` | `Apply f => (c -> f c) -> (a -> f b) -> m (f a) -> f (m b)` |
| `value` | `m a -> a` |

##### Datatypes
| Function | Datatypes |
|---|---|
| `ap` | `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `State`, `Unit`, `Writer` |
| `bimap` | `Either`, `Pair` |
| `chain` | `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `State`, `Unit`, `Writer` |
| `coalesce` | `Maybe`, `Either` |
| `concat` | `Array`, `String`, `Arrow`, `Const`, `List`, `Pair`, `Unit`, `All`, `Any`, `Assign`, `Max`, `Min`, `Prod`, `Sum` |
| `cons` | `Array`, `List` |
| `contramap` | `Arrow` |
| `either` | `Either`, `Maybe` |
| `evalWith` | `State` |
| `execWith` | `State` |
| `filter` | `Array`, `List` |
| `first` | `Arrow` |
| `fst` | `Pair` |
| `head` | `Array, List` |
| `log` | `Writer` |
| `map` | `Array`, `Function`, `Arrow`, `Const`, `Either`, `Identity`, `IO`, `List`, `Maybe`, `Pair`, `Reader`, `State`, `Unit`, `Writer` |
| `maybe` | `Maybe` |
| `merge` | `Pair` |
| `option` | `Either`, `Maybe` |
| `promap` | `Arrow` |
| `read` | `Writer` |
| `reduce` | `Array`, `List` |
| `run` | `IO` |
| `runWith` | `Arrow`, `Reader`, `State` |
| `second` | `Arrow` |
| `sequence` | `Either`, `Identity`, `List`, `Maybe` |
| `snd` | `Pair` |
| `swap` | `Pair` |
| `tail` | `Array`, `String`, `List` |
| `traverse` | `Either`, `Identity`, `List`, `Maybe` |
| `value` | `Arrow`, `Const`, `Either`, `Identity`, `List`, `Pair`, `Unit`, `Writer` |
