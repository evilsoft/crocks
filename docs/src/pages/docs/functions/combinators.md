---
description: "Combinators API"
layout: "notopic"
title: "Combinators"
weight: 1
---

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
[`compose`](helpers.html#compose).)

#### constant

`crocks/combinators/constant`

```haskell
constant :: a -> () -> a
```

This is a very handy dandy function, used a lot. Pass it any value and it will
give you back a function that will return that same value no matter what you
pass it.

#### flip

`crocks/combinators/flip`

```haskell
flip :: (a -> b -> c) -> b -> a -> c
```

This little function just takes a function and returns a function that takes
the first two parameters in reverse. One can compose flip calls down the line to
flip all, or some of the other parameters if there are more than two. Mix and
match to your heart's desire.

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
