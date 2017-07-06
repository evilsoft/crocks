/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('./core/Async')
const Maybe = require('./core/Maybe')
const constant = require('./core/constant')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

// maybeToAsync : e -> Maybe a -> Async e a
// maybeToAsync : e -> (a -> Maybe b) -> a -> Async e b
function maybeToAsync(left, maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToAsync: Maybe returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }

  throw new TypeError('maybeToAsync: Maybe or Maybe returing function required for second argument')
}

module.exports = curry(maybeToAsync)
