/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Last = require('../monoids/Last')

const applyTransform = last =>
  last.value()

// lastToMaybe : Last a -> Maybe a
// lastToMaybe : (a -> Last b) -> a -> Maybe b
function lastToMaybe(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToMaybe: Last returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToMaybe: Last or Last returing function required')
}

module.exports = curry(lastToMaybe)
