/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Result = require('.')
const Last = require('../core/types').proxy('Last')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const applyTransform = (left, last) =>
  last.valueOf().either(
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
        throw new TypeError('lastToResult: Last returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(left, last)
  }

  throw new TypeError('lastToResult: Last or Last returning function required for second argument')
}

module.exports = curry(lastToResult)
