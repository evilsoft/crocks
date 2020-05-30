/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

const curry = require('../core/curry')
const isSameType = require('../core/isSameType')
const isFunction = require('../core/isFunction')

const Async = require('../core/types').proxy('Async')

const toPromise = m => {
  if(!isSameType(Async, m)) {
    throw new TypeError('asyncToPromise: Argument must be an Async or a Function that returns an Async')
  }

  return m.toPromise()
}

/** asyncToPromise :: m e a -> Promise a e */
/** asyncToPromise :: (a -> m e b) -> a -> Promise b e */
function asyncToPromise(m) {
  return isFunction(m)
    ? x => toPromise(m(x))
    : toPromise(m)
}

module.exports = curry(asyncToPromise)
