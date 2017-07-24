/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const First = require('../core/types').proxy('First')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = first =>
  first.value()

// firstToMaybe : First a -> Maybe a
// firstToMaybe : (a -> First b) -> a -> Maybe b
function firstToMaybe(first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToMaybe: First returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(first)
  }

  throw new TypeError('firstToMaybe: First or First returing function required')
}

module.exports = curry(firstToMaybe)
