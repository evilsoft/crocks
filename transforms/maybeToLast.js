/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Maybe = require('../crocks/Maybe')
const Last = require('../monoids/Last')

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
