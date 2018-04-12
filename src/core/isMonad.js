/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isApplicative from './isApplicative.js'

// isMonad : a -> Boolean
function isMonad(m) {
  return isApplicative(m)
    && hasAlg('chain', m)
}

export default isMonad
