/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Either = require('.')
const Result = require('../core/types').proxy('Result')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = result =>
  result.either(Either.Left, Either.Right)

// resultToEither : Result e a -> Either e a
// resultToEither : (a -> Result e b) -> a -> Either e b
function resultToEither(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToEither: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToEither: Result or Result returning function required')
}

module.exports = curry(resultToEither)
