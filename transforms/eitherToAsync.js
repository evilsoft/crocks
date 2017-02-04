/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isType = require('../internal/isType')

const Either = require('../crocks/Either')
const Async = require('../crocks/Async')

const applyTransform = either =>
  either.either(Async.rejected, Async.of)

// eitherToAsync : Either e a -> Async e a
// eitherToAsync : (a -> Either e b) -> a -> Async e b
function eitherToAsync(either) {
  if(isType(Either.type(), either)) {
    return applyTransform(either)
  }
  else if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isType(Either.type(), m)) {
        throw new TypeError('eitherToAsync: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('eitherToAsync: Either or Either returing function required')
}

module.exports = curry(eitherToAsync)
