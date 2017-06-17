/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const constant = require('../combinators/constant')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Last = require('../monoids/Last')
const Result = require('../crocks/Result')

const applyTransform = (left, last) =>
  last.value().either(
    constant(Result.Err(left)),
    Result.Ok
  )

// lastToResult : c -> Last a -> Result c a
// lastToResult : c -> (a -> Last b) -> a -> Result c b
function lastToResult(left, last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToResult: Last returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(left, last)
  }

  throw new TypeError('lastToResult: Last or Last returing function required for second argument')
}

module.exports = curry(lastToResult)
