/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('./core/Async')
const Result = require('./core/Result')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const applyTransform = either =>
  either.either(Async.Rejected, Async.Resolved)

// resultToAsync : Result e a -> Async e a
// resultToAsync : (a -> Result e b) -> a -> Async e b
function resultToAsync(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToAsync: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToAsync: Result or Result returing function required')
}

module.exports = curry(resultToAsync)
