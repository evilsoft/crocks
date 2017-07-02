/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Last = require('./core/Last')
const Maybe = require('./core/Maybe')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const applyTransform = maybe =>
  Last(maybe)

// maybeToLast : Maybe a -> Last a
// maybeToLast : (a -> Maybe b) -> a -> Last b
function maybeToLast(maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToLast: Maybe returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(maybe)
  }

  throw new TypeError('maybeToLast: Maybe or Maybe returing function required')
}

module.exports = curry(maybeToLast)
