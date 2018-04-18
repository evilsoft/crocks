/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isAlt from './isAlt.js'

// isPlus : a -> Boolean
function isPlus(m) {
  return isAlt(m)
    && hasAlg('zero', m)
}

export default isPlus
