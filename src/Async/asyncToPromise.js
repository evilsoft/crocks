/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

const curry = require('../core/curry')
const isSameType = require('../core/isSameType')
const isFunction = require('../core/isFunction')

const Async = require('../core/types').proxy('Async')

const toPromise = m => {
  if(!isSameType(Async, m)) {
    throw new TypeError('asyncToPromise: Async or a function returning an Async required')
  }

  return m.toPromise()
}

// asyncToPromise :: m e a -> Promise a e
// asyncToPromise :: (a -> m e b) -> a -> Promise b e
function asyncToPromise(async) {
  return isFunction(async)
    ? x => toPromise(async(x))
    : toPromise(async)
}

module.exports = curry(asyncToPromise)
