/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isString from './isString'
import hasAlg from './hasAlg'

// isSemigroup : a -> Boolean
export default function isSemigroup(m) {
  return isString(m)
    || !!m && hasAlg('concat', m)
}
