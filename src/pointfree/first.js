/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { proxy } from '../core/types'
const Pair = proxy('Pair')

import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const identity = x => x

export default function first(m) {
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
