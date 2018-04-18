/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isSameType from './isSameType.js'
import isSemigroup from './isSemigroup.js'

function innerConcat(method, m) {
  return function(left) {
    if(!isSemigroup(left)) {
      throw new TypeError(`${method}: Both containers must contain Semigroups of the same type`)
    }

    return m.map(right => {
      if(!isSameType(left, right)) {
        throw new TypeError(`${method}: Both containers must contain Semigroups of the same type`)
      }

      return left.concat(right)
    })
  }
}

export default innerConcat
