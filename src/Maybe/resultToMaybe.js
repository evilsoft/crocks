/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Maybe = require('.')
const Result = require('../core/types').proxy('Result')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = result =>
  result.either(Maybe.Nothing, Maybe.Just)

// resultToMaybe : Result b a -> Maybe a
// resultToMaybe : (a -> Result c b) -> a -> Maybe b
function resultToMaybe(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToMaybe: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToMaybe: Result or Result returning function required')
}

module.exports = curry(resultToMaybe)
