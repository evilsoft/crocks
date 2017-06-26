/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Result = require('../crocks/Result')
const First = require('../monoids/First')

const applyTransform = result =>
  result.either(First.empty, First)

// resultToFirst : Result b a -> First a
// resultToFirst : (a -> Result c b) -> a -> First b
function resultToFirst(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToFirst: Result returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToFirst: Result or Result returing function required')
}

module.exports = curry(resultToFirst)
