/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Last = require('../monoids/Last')
const First = require('../monoids/First')

const applyTransform = last =>
  First(last.value())

// lastToFirst : Last a -> First a
// lastToFirst : (a -> Last b) -> a -> First b
function lastToFirst(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToFirst: Last returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToFirst: Last or Last returing function required')
}

module.exports = curry(lastToFirst)
