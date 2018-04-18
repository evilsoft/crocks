/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isApply from './isApply.js'

// isApplicative : a -> Boolean
function isApplicative(m) {
  return isApply(m)
    && hasAlg('of', m)
}

export default isApplicative
