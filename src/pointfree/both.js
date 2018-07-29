/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { proxy } from '../core/types'

import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const Pair = proxy('Pair')

export default function both(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('both: Pair required as input')
      }

      return x.bimap(m, m)
    }
  }

  if(m && isFunction(m.both)) {
    return m.both()
  }

  throw new TypeError('both: Strong Function or Profunctor required')
}
