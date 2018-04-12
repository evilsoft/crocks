/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

const isWriter =
  x => !!x && isFunction(x.read)

const applyTransform = w =>
  w.read()

// writerToPair : Monoid m => Writer m a -> Pair m a
// writerToPair : Monoid m => (a -> Writer m a) -> Pair m b
function writerToPair(writer) {
  if(isFunction(writer)) {
    return function(x) {
      const m = writer(x)

      if(!isWriter(m)) {
        throw new TypeError('writerToPair: Writer returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isWriter(writer)) {
    return applyTransform(writer)
  }

  throw new TypeError('writerToPair: Writer or Writer returning function required')
}

export default curry(writerToPair)
