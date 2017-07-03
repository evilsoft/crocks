/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const constant = require('../combinators/constant')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const First = require('../monoids/First')
const Result = require('../crocks/Result')

const applyTransform = (left, first) =>
  first.value().either(
    constant(Result.Err(left)),
    Result.Ok
  )

// firstToResult : c -> First a -> Result c a
// firstToResult : c -> (a -> First b) -> a -> Result c b
function firstToResult(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToResult: First returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToResult: First or First returing function required for second argument')
}

module.exports = curry(firstToResult)
