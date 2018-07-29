/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isSemigroup from './isSemigroup'

// isMonoid :: a -> Boolean
export default function isMonoid(m) {
  return isSemigroup(m)
    && (hasAlg('empty', m) || hasAlg('empty', m.constructor))
}
