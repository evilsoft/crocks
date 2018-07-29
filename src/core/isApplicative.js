/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isApply from './isApply'

// isApplicative : a -> Boolean
export default function isApplicative(m) {
  return isApply(m)
    && (hasAlg('of', m) || hasAlg('of', m.constructor))
}
