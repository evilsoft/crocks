/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const First = require('.')
const Last = require('../core/types').proxy('Last')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = last =>
  First(last.valueOf())

// lastToFirst : Last a -> First a
// lastToFirst : (a -> Last b) -> a -> First b
function lastToFirst(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToFirst: Last returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToFirst: Last or Last returning function required')
}

module.exports = curry(lastToFirst)
