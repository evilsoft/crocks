/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

import curry from '../core/curry'
import isSameType from '../core/isSameType'
import isFunction from '../core/isFunction'
import types from '../core/types'

const Async = types.proxy('Async')

const toPromise = m => {
  if(!isSameType(Async, m)) {
    throw new TypeError('asyncToPromise: Async or a function returning an Async required')
  }

  return m.toPromise()
}

// asyncToPromise :: m e a -> Promise a e
// asyncToPromise :: (a -> m e b) -> a -> Promise b e
function asyncToPromise(m) {
  return isFunction(m)
    ? x => toPromise(m(x))
    : toPromise(m)
}

export default curry(asyncToPromise)
