/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const First = require('.')
const Maybe = require('../core/types').proxy('Maybe')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = maybe =>
  First(maybe)

// maybeToFirst : Maybe a -> First a
// maybeToFirst : (a -> Maybe b) -> a -> First b
function maybeToFirst(maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToFirst: Maybe returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(maybe)
  }

  throw new TypeError('maybeToFirst: Maybe or Maybe returning function required')
}

module.exports = curry(maybeToFirst)
