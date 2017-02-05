/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Either = require('../crocks/Either')
const Result = require('../crocks/Result')

const applyTransform = either =>
  either.either(Result.Err, Result.Ok)

// eitherToResult : Either e a -> Result e a
// eitherToResult : (a -> Either e b) -> a -> Result e b
function eitherToResult(either) {
  if(isSameType(Either, either)) {
    return applyTransform(either)
  }
  else if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToResult: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('eitherToResult: Either or Either returing function required')
}

module.exports = curry(eitherToResult)
