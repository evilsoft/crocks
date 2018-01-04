/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Either = require('.')
const First = require('../core/types').proxy('First')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const applyTransform = (left, first) =>
  first.valueOf().either(
    constant(Either.Left(left)),
    Either.Right
  )

// firstToEither : c -> First a -> Either c a
// firstToEither : c -> (a -> First b) -> a -> Either c b
function firstToEither(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToEither: First returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToEither: First or First returning function required for second argument')
}

module.exports = curry(firstToEither)
