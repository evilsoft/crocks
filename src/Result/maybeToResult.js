/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Result = require('.')
const Maybe = require('../core/types').proxy('Maybe')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Result.Err(left)),
    Result.Ok
  )

// maybeToResult : c -> Maybe a -> Result c a
// maybeToResult : c -> (a -> Maybe b) -> a -> Result c b
function maybeToResult(left, maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToResult: Maybe returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }

  throw new TypeError('maybeToResult: Maybe or Maybe returning function required for second argument')
}

module.exports = curry(maybeToResult)
