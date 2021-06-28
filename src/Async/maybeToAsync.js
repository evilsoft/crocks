/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('.')
const Maybe = require('../core/types').proxy('Maybe')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

/** maybeToAsync :: e -> Maybe a -> Async e a */
/** maybeToAsync :: e -> (a -> Maybe b) -> a -> Async e b */
function maybeToAsync(left, maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToAsync: Second argument must be a Function that returns a Maybe')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }

  throw new TypeError('maybeToAsync: Second argument must be a Maybe or a Function that returns a Maybe')
}

module.exports = curry(maybeToAsync)
