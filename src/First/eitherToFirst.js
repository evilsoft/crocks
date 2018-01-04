/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const First = require('.')
const Either = require('../core/types').proxy('Either')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = either =>
  either.either(First.empty, First)

// eitherToFirst : Either b a -> First a
// eitherToFirst : (a -> Either c b) -> a -> First b
function eitherToFirst(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToFirst: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToFirst: Either or Either returning function required')
}

module.exports = curry(eitherToFirst)
