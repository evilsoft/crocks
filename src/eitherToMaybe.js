/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Either = require('./core/Either')
const Maybe = require('./core/Maybe')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const applyTransform = either =>
  either.either(Maybe.Nothing, Maybe.Just)

// eitherToMaybe : Either b a -> Maybe a
// eitherToMaybe : (a -> Either c b) -> a -> Maybe b
function eitherToMaybe(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToMaybe: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToMaybe: Either or Either returing function required')
}

module.exports = curry(eitherToMaybe)
