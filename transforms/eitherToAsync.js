/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Either = require('../crocks/Either')
const Async = require('../crocks/Async')

const applyTransform = either =>
  either.either(Async.Rejected, Async.Resolved)

// eitherToAsync : Either e a -> Async e a
// eitherToAsync : (a -> Either e b) -> a -> Async e b
function eitherToAsync(either) {
  if(isSameType(Either, either)) {
    return applyTransform(either)
  }
  else if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToAsync: Either returing function required')
      }

      return applyTransform(m)
    }
  }

  throw new TypeError('eitherToAsync: Either or Either returing function required')
}

module.exports = curry(eitherToAsync)
