---
description: "Logic Functions API"
layout: "notopic"
title: "Logic Functions"
weight: 3
---

The functions in this section are used to represent logical branching in a
declarative manner. Each of these functions require either `Pred`s or predicate
functions in their input. Since these functions work with `Pred`s and predicate
functions, rather than values, this allows for composeable, "lazy" evaluation.
All logic functions can be referenced from `crocks/logic`

#### and

```haskell
and :: ((a -> Boolean) | Pred a) -> ((a -> Boolean) | Pred a) -> a -> Boolean
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
ifElse :: ((a -> Boolean) | Pred a) -> (a -> b) -> (a -> b) -> a -> b
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
