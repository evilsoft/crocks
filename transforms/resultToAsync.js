/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Result = require('../crocks/Result')
const Async = require('../crocks/Async')

const applyTransform = either =>
  either.either(Async.Rejected, Async.Resolved)

// resultToAsync : Result e a -> Async e a
// resultToAsync : (a -> Result e b) -> a -> Async e b
function resultToAsync(result) {
  if(isSameType(Result, result)) {
    return applyTransform(result)
  }
  else if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToAsync: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('resultToAsync: Result or Result returing function required')
}

module.exports = curry(resultToAsync)
