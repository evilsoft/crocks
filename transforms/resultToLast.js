/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Result = require('../crocks/Result')
const Last = require('../monoids/Last')

const applyTransform = result =>
  result.either(Last.empty, Last)

// resultToLast : Result b a -> Last a
// resultToLast : (a -> Result c b) -> a -> Last b
function resultToLast(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToLast: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToLast: Result or Result returing function required')
}

module.exports = curry(resultToLast)
