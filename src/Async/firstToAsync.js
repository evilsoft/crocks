/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Async = require('.')
const First = require('../core/types').proxy('First')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const applyTransform = (left, first) =>
  first.valueOf().either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

/** firstToAsync :: e -> First a -> Async e a */
/** firstToAsync :: e -> (a -> First b) -> a -> Async e b */
function firstToAsync(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToAsync: Second argument must be a Function that returns a First')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToAsync: Second argument must be a First or a Function that returns a First')
}

module.exports = curry(firstToAsync)
