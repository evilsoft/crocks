/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const First = require('../monoids/First')
const Last = require('../monoids/Last')

const applyTransform = first =>
  Last(first.value())

// firstToLast : First a -> Last a
// firstToLast : (a -> First b) -> a -> Last b
function firstToLast(first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToLast: First returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(first)
  }

  throw new TypeError('firstToLast: First or First returing function required')
}

module.exports = curry(firstToLast)
