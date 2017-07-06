/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Either = require('./core/Either')
const First = require('./core/First')
const constant = require('./core/constant')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const applyTransform = (left, first) =>
  first.value().either(
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
        throw new TypeError('firstToEither: First returing function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToEither: First or First returing function required for second argument')
}

module.exports = curry(firstToEither)
