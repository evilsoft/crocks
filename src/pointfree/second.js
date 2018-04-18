/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Pair from '../core/types').proxy('Pair.js'

import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const identity = x => x

function second(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('second: Pair required as input')
      }

      return x.bimap(identity, m)
    }
  }

  if(m && isFunction(m.second)) {
    return m.second()
  }

  throw new TypeError('second: Arrow, Function or Star required')
}

export default second
