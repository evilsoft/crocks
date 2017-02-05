/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Result = require('../crocks/Result')
const Either = require('../crocks/Either')

const applyTransform = result =>
  result.either(Either.Left, Either.Right)

// resultToEither : Result e a -> Either e a
// resultToEither : (a -> Result e b) -> a -> Either e b
function resultToEither(result) {
  if(isSameType(Result, result)) {
    return applyTransform(result)
  }
  else if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToEither: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('resultToEither: Result or Result returing function required')
}

module.exports = curry(resultToEither)
