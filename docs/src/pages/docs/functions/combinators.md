---
description: "Combinators API"
layout: "notopic"
title: "Combinators"
functions: ["applyto", "composeb", "constant", "converge", "flip", "identity", "substitution"]
weight: 10
---

#### applyTo

`crocks/combinators/applyTo`

```haskell
applyTo :: a -> (a -> b) -> b
```

Ever run into a situation where you have a value but do not have a function to
apply it to? Well this little bird, named Thrush, is there to help out. Just
give it a value and it will give you back a function ready to take a function.
Once that function is provided, it will return the result of applying your value
to that function.

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
[`compose`](helpers.html#compose).)

#### constant

`crocks/combinators/constant`

```haskell
constant :: a -> () -> a
```

This is a very handy dandy function, used a lot. Pass it any value and it will
give you back a function that will return that same value no matter what you
pass it.

#### converge

`crocks/combinators/converge`

```haskell
converge :: (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
```

Provides a means of passing an acculumating function and two branching functions.
A value can be applied to the resulting function which will then be applied to
each branching function, the results of which will be applied to the accumulating
function.

```javascript
import converge from 'crocks/combinators/converge'

import Maybe from 'crocks/Maybe'
import alt from 'crocks/pointfree/alt'
import prop from 'crocks/Maybe/prop'

const { Just } = Maybe

// data :: [ Number ]
const data = [ 1, 2, 3, 4, 5 ]

// divide :: Number -> Number -> Number
const divide = x => y => x / y

// sum :: [ Number ] -> Number
const sum = xs => xs.reduce((m, n) => m + n, 0)

// length :: [ a ] -> Number
const length = xs => xs.length

// average :: [ Number ] -> Number
const average = converge(divide, sum, length)

average(data)
//=> 3

// maybeGetDisplay :: a -> Maybe b
const maybeGetDisplay = prop('display')

// maybeGetFirst :: a -> Maybe b
const maybeGetFirst = prop('first')

// maybeGetLast :: a -> Maybe b
const maybeGetLast = prop('last')

// maybeConcatStrings :: Maybe String -> Maybe String -> Maybe String
const maybeConcatStrings = x => y => Just(x => y => x + ' ' + y).ap(x).ap(y).alt(x).alt(y)

// maybeMakeDisplay :: a -> Maybe String
const maybeMakeDisplay = converge(maybeConcatStrings, maybeGetFirst, maybeGetLast)

// maybeGetName :: a -> Maybe b
const maybeGetName = converge(alt, maybeGetDisplay, maybeMakeDisplay)

maybeGetName({ display: 'Jack Sparrow' })
//=> Just('Jack Sparrow')

maybeGetName({ first: 'J', last: 'S' })
//=> Just('J S')

maybeGetName({ display: 'Jack Sparrow', first: 'J', last: 'S' })
//=> Just('Jack Sparrow')

maybeGetName({ first: 'J' })
//=> Just('J')

maybeGetName({ first: 'S' })
//=> Just('S')
```

#### flip

`crocks/combinators/flip`

```haskell
flip :: (a -> b -> c) -> b -> a -> c
```

This little function just takes a function and returns a function that takes
the first two parameters in reverse. `flip` is perfectly suited for those
moments where you have the context of your function but not the data. Applying
`flip` to the function will allow you to pass in your context and will return a
function waiting for the data. This will happen often when you're using composition.

When required, one can compose flip calls down the line to flip all, or some of
the other parameters if there are more than two. Mix and match to your heart's
desire.

```javascript
import flip from 'crocks/combinators/flip'

import isNumber from 'crocks/predicates/isNumber'
import Pred from 'crocks/Pred'
import mconcat from 'crocks/helpers/mconcat'
import runWith from 'crocks/pointfree/runWith'
import composeB from 'crocks/combinators/composeB'
import concat from 'crocks/pointfree/concat'

concat('first param. ', 'second param. ')
//=> "second param. first param. ""

flip(concat, 'first param. ', 'second param. ')
//=> "first param. second param. ""

// checkAll :: [ a -> Boolean ] -> a -> Boolean
const checkAll = composeB(flip(runWith), mconcat(Pred))

// lte :: Number -> Number -> Number
const lte = a => b => b <= a

// lte :: Number -> Number -> Number
const gte = a => b => b >= a

// between2and10 :: a -> Boolean
const between2and10 = checkAll([
  isNumber,
  gte(2),
  lte(10)
])

between2and10(8)
//=> true

between2and10(11)
//=> false

between2and10(1)
//=> false

between2and10('not a number')
//=> false
```

#### identity

`crocks/combinators/identity`

```haskell
identity ::  a -> a
```

This function and [`constant`](#constant) are the workhorses of writing code
with this library. It quite simply is just a function that when you pass it
something, it returns that thing right back to you. So simple, I will leave it
as an exercise to reason about why this is so powerful and important.

#### substitution

`crocks/combinators/substitution`

```haskell
substitution :: (a -> b -> c) -> (a -> b) -> a -> c
```

While it may seem like a complicated little bugger, `substitution` can come in
very handy from time to time. `substitution` is used when you have a `binary`
function and you can supply the first argument and can use that value to create
the second argument. It first takes a `binary` function followed by a `unary`
function for it's first two arguments. This will return a function that is ready
to take some context, `a`. Once supplied the fun starts, it will pass the given
`a` to the `binary` and `unary` functions, and will then apply the result of
the `unary` function as the second parameter of the `binary` function. Finally
after all that juggling, it will return the result of that `binary` function.

When used with partial application on that first parameter, a whole new world
of combinatory madness is presented!

```javascript
import substitution from 'crocks/combinators/substitution'

import curry from 'crocks/core/curry'
import composeB from 'crocks/combinators/composeB'

// getDetails :: String -> Number -> String
const getDetails = curry((text, length) => 
  `The given text "${text}" has a length of ${length}`
)

// getLength :: a -> Number
const getLength = s => 
  s.length

substitution(getDetails, getLength, 'testing')
//=> "The given text \"testing\" has a length of 7"

// getLastIndex :: a -> Number
const getLastIndex = composeB(
  x => x - 1,
  getLength
)

// slice :: Array -> Array
const slice = curry((arr, index) => 
  arr.slice(index))

substitution(slice, getLastIndex, [ 1, 2, 3, 4, 5 ])
//=> [ 5 ]
```
