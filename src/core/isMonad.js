/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isApplicative from './isApplicative'

// isMonad : a -> Boolean
export default function isMonad(m) {
  return isApplicative(m)
    && hasAlg('chain', m)
}
