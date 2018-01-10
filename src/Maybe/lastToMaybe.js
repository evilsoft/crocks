/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Last = require('../core/types').proxy('Last')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = last =>
  last.valueOf()

// lastToMaybe : Last a -> Maybe a
// lastToMaybe : (a -> Last b) -> a -> Maybe b
function lastToMaybe(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToMaybe: Last returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToMaybe: Last or Last returning function required')
}

module.exports = curry(lastToMaybe)
