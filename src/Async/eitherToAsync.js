/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('.')
const Either = require('../core/types').proxy('Either')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = either =>
  either.either(Async.Rejected, Async.Resolved)

/** eitherToAsync :: Either e a -> Async e a */
/** eitherToAsync :: (a -> Either e b) -> a -> Async e b */
function eitherToAsync(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToAsync: Argument must be a Function that returns an Either')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToAsync: Argument must be an Either or a Function that returns an Either')
}

module.exports = curry(eitherToAsync)
