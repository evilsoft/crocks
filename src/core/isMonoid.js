/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isSemigroup from './isSemigroup.js'

// isMonoid :: a -> Boolean
function isMonoid(m) {
  return isSemigroup(m)
    && hasAlg('empty', m)
}

export default isMonoid
