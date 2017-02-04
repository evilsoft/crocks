/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isType = require('../internal/isType')

const Either = require('../crocks/Either')
const Maybe = require('../crocks/Maybe')

const applyTransform = either =>
  either.either(Maybe.Nothing, Maybe.Just)

// eitherToMaybe : Either b a -> Maybe a
// eitherToMaybe : (a -> Either c b) -> a -> Maybe b
function eitherToMaybe(either) {
  if(isType(Either.type(), either)) {
    return applyTransform(either)
  }
  else if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isType(Either.type(), m)) {
        throw new TypeError('eitherToMaybe: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('eitherToMaybe: Either or Either returing function required')
}

module.exports = curry(eitherToMaybe)
