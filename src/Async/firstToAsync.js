/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('../core/Async')
const First = require('../core/First')
const curry = require('../core/curry')
const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = (left, first) =>
  first.value().either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

// firstToAsync : e -> First a -> Async e a
// firstToAsync : e -> (a -> First b) -> a -> Async e b
function firstToAsync(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToAsync: First returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToAsync: First or First returing function required for second argument')
}

module.exports = curry(firstToAsync)
