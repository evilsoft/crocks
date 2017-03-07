/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Result = require('../crocks/Result')
const Maybe = require('../crocks/Maybe')

const applyTransform = either =>
  either.either(Maybe.Nothing, Maybe.Just)

// resultToMaybe : Result b a -> Maybe a
// resultToMaybe : (a -> Result c b) -> a -> Maybe b
function resultToMaybe(result) {
  if(isSameType(Result, result)) {
    return applyTransform(result)
  }
  else if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToMaybe: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('resultToMaybe: Result or Result returing function required')
}

module.exports = curry(resultToMaybe)
