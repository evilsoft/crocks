/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import fl from '../core/flNames'
import hasAlg from '../core/hasAlg'
import isSameType from '../core/isSameType'

export default function empty(m) {
  if(m && hasAlg('empty', m)) {
    return (m[fl.empty] || m.empty).call(m)
  }

  if(m && hasAlg('empty', m.constructor)) {
    return (m.constructor[fl.empty] || m.constructor.empty).call(m)
  }

  if(isSameType([], m)) {
    return []
  }

  if(isSameType('', m)) {
    return ''
  }

  if(isSameType({}, m)) {
    return {}
  }

  throw new TypeError('empty: Monoid, Array, String or Object required')
}
