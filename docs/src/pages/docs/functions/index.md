---
title: "Functions"
description: "functions"
layout: "notopic"
icon: "code-file"
weight: 4
---

There are (6) function classifications included in this library:

* [Combinators](combinators.html): A collection of functions that are used for
working with other functions. These do things like compose (2) functions
together, or flip arguments on a function. They typically either take a
function, return a function or a bit a both. These are considered the glue that
holds the mighty house of `crocks` together and a valuable aid in writing
reusable code.

* [Helper Functions](helpers.html): All other support functions that are
either convenient versions of combinators or not even combinators at all cover
this group.

* [Logic Functions](logic-functions.html): A helpful collection of Logic based
combinators. All of these functions work with predicate functions and let you
combine them in some very interesting ways.

* [Predicate Functions](predicate-functions.html): A helpful collection of predicate
functions to get you started.

* [Point-free Functions](pointfree-functions.html): Wanna use these ADTs in a way
that you never have to reference the actual data being worked on? Well here is
where you will find all of these functions to do that. For every algebra
available on both the `Crocks` and `Monoids` there is a function here.

* [Transformation Functions](transformation-functions.html): All the functions found
here are used to transform from one type to another, naturally. These come are
handy in situations where you have functions that return one type (like an
`Either`), but are working in a context of another (say `Maybe`). You would
like to compose these, but in doing so will result in a nesting that you will
need to account for for the rest of your flow.
