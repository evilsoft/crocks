/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const constant = require('../combinators/constant')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Maybe = require('../crocks/Maybe')
const Result = require('../crocks/Result')

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Result.Err(left)),
    Result.Ok
  )

// maybeToResult : c -> Maybe a -> Result c a
// maybeToResult : c -> (a -> Maybe b) -> a -> Result c b
function maybeToResult(left, maybe) {
  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }
  else if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToResult: Maybe returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  throw new TypeError('maybeToResult: Maybe or Maybe returing function required for second argument')
}

module.exports = curry(maybeToResult)
