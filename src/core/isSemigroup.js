/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isString from './isString.js'
import hasAlg from './hasAlg.js'

// isSemigroup : a -> Boolean
function isSemigroup(m) {
  return isString(m)
    || !!m && hasAlg('concat', m)
}

export default isSemigroup
