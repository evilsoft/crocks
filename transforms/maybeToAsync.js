/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const constant = require('../combinators/constant')

const isFunction = require('../predicates/isFunction')
const isType = require('../internal/isType')

const Maybe = require('../crocks/Maybe')
const Async = require('../crocks/Async')

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Async.rejected(left)),
    Async.of
  )

// maybeToAsync : e -> Maybe a -> Async e a
// maybeToAsync : e -> (a -> Maybe b) -> a -> Async e b
function maybeToAsync(left, maybe) {
  if(isType(Maybe.type(), maybe)) {
    return applyTransform(left, maybe)
  }
  else if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isType(Maybe.type(), m)) {
        throw new TypeError('maybeToAsync: Maybe returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  throw new TypeError('maybeToAsync: Maybe or Maybe returing function required for second argument')
}

module.exports = curry(maybeToAsync)
