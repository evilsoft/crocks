---
description: "Predicate Functions API"
layout: "notopic"
title: "Predicate Functions"
functions: ["hasprop", "hasprops", "hasproppath", "isalt", "isalternative", "isapplicative", "isapply", "isarray", "isbifunctor", "isboolean", "iscategory", "ischain", "iscontravariant", "isDate", "isdefined", "isempty", "isextend", "isfalse", "isfalsy", "isfoldable", "isfunction", "isfunctor", "isinteger", "isiterable", "ismap", "ismonad", "ismonoid", "isnil", "isnumber", "isobject", "isplus", "isprofunctor", "ispromise", "issame", "issametype", "issemigroup", "issemigroupoid", "issetoid", "isstring", "istraversable", "istrue", "istruthy", "patheq", "pathsatisfies", "propeq", "propsatisfies"]
weight: 40
---

All functions in this group have a signature of `* -> Boolean` and are used with
the many predicate based functions that ship with `crocks`,
like [`safe`][safe], [`ifElse`][ifelse] and `filter` to name a few. They also
fit naturally with the [`Pred`][pred] ADT. All predicate functions can be referenced
from `crocks/predicates`.

Below is a list of all the current predicates that are included with a
description of their truth:

* `hasProp :: (String | Integer) -> a -> Boolean`: an `Array` or `Object` that contains the provided index or key
* `hasProps :: Foldable f => f (String | Integer) -> a -> Boolean`: an `Array` or `Object` that contains the provided indexs or keys
* `hasPropPath :: [ String | Integer ] -> a -> Boolean`: an `Array` or `Object` that contains the provided index path
* `isAlt :: a -> Boolean`: an ADT that provides `map` and `alt` methods
* `isAlternative :: a -> Boolean`: an ADT that provides `alt`, `zero`, `map`, `ap`, `chain` and `of`methods
* `isApplicative :: a -> Boolean`: an ADT that provides `map`, `ap` and `of` methods
* `isApply :: a -> Boolean`: an ADT that provides `map` and `ap` methods
* `isArray :: a -> Boolean`: Array
* `isBifunctor :: a -> Boolean`: an ADT that provides `map` and `bimap` methods
* `isBoolean :: a -> Boolean`: Boolean
* `isCategory :: a -> Boolean`: an ADT that provides `id` and `compose` methods
* `isChain :: a -> Boolean`: an ADT that provides `map`, `ap` and `chain` methods
* `isContravariant :: a -> Boolean`: an ADT that provides `contramap` method
* `isDate :: a -> Boolean`: Date
* `isDefined :: a -> Boolean`: Every value that is not `undefined`, `null` included
* `isEmpty :: a -> Boolean`: Empty Monoid, Object, Array, String, undefined, null, all Numbers and Boolean values
* `isExtend :: a -> Boolean`: an ADT that provides `map` and `extend` methods
* `isFalse :: a -> Boolean`: a value that is strictly equal to `false`
* `isFalsy :: a -> Boolean`: a value that is considered to be [`falsy`][falsy]
* `isFoldable :: a -> Boolean`: Array, List or any structure with a `reduce` method
* `isFunction :: a -> Boolean`: Function
* `isFunctor :: a -> Boolean`: an ADT that provides a `map` method
* `isInteger :: a -> Boolean`: Integer
* `isIterable :: a -> Boolean`: an `Object` with an `iterator` method
* `isMap :: a -> Boolean`: Map
* `isMonad :: a -> Boolean`: an ADT that provides `map`, `ap`, `chain` and `of` methods
* `isMonoid :: a -> Boolean`: an ADT that provides `concat` and `empty` methods
* `isNil :: a -> Boolean`: `undefined` or `null` or `NaN`
* `isNumber :: a -> Boolean`: `Number` that is not a `NaN` value, `Infinity` included
* `isObject :: a -> Boolean`: Plain Old JavaScript Object (POJO)
* `isPlus :: a -> Boolean`: an ADT that provides `map`, `alt` and `zero` methods
* `isProfunctor :: a -> Boolean`: an ADT that provides `map`, `contramap` and `promap` methods
* `isPromise :: a -> Boolean`: an object implementing `then` and `catch`
* `isSame :: a -> b -> Boolean`: same value or reference, use `equals` for value equality
* `isSameType :: a -> b -> Boolean`: Constructor matches a values type, or two values types match
* `isSemigroup :: a -> Boolean`: an ADT that provides a `concat` method
* `isSemigroupoid :: a -> Boolean`: an ADT that provides a `compose` method
* `isSetoid :: a -> Boolean`: an ADT that provides an `equals` method
* `isString :: a -> Boolean`: String
* `isSymbol :: a -> Boolean`: Symbol
* `isTraversable :: a -> Boolean`: an ADT that provides `map` and `traverse` methods
* `isTrue :: a -> Boolean`: a value that is strictly equal to `true`
* `isTruthy :: a -> Boolean`: a value that is considered to be [`truthy`][truthy]
* `pathEq :: [ String | Integer ] -> a -> Object -> Boolean`: an `Object` that contains the provided key in the  traversal path, with a value equal to the provided value. (equality by value)
* `pathSatisfies :: [ String | Integer ] -> ((a -> Boolean) | Pred) -> Object -> Boolean`: an `Object` that contains the provided key in the traversal path with a value that passes the provided predicate.
* `propEq :: (String | Integer) -> a -> Object -> Boolean`: an `Object` that contains the provided key with a value equal to the provided value. (equality by value)
* `propSatisfies :: (String | Integer) -> ((a -> Boolean) | Pred) -> Object -> Boolean`: an `Object` that contains the provided key with a value that passes the provided predicate.

[pred]: ../crocks/Pred.html
[ifelse]: logic-functions.html#ifelse
[safe]: helpers.html#safe
[truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
[falsy]: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
