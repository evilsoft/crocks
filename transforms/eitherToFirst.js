/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Either = require('../crocks/Either')
const First = require('../monoids/First')

const applyTransform = either =>
  either.either(First.empty, First)

// eitherToFirst : Either b a -> First a
// eitherToFirst : (a -> Either c b) -> a -> First b
function eitherToFirst(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToFirst: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToFirst: Either or Either returing function required')
}

module.exports = curry(eitherToFirst)
