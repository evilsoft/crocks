---
description: "Predicate Functions API"
layout: "guide"
title: "Predicate Functions"
weight: 6
---

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
