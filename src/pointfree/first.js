/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Pair from '../core/types').proxy('Pair.js'

import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const identity = x => x

function first(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('first: Pair required as input')
      }

      return x.bimap(m, identity)
    }
  }

  if(m && isFunction(m.first)) {
    return m.first()
  }

  throw new TypeError('first: Arrow, Function or Star required')
}

export default first
