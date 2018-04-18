/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isApply from './isApply.js'

// isChain : a -> Boolean
function isChain(m) {
  return isApply(m)
    && hasAlg('chain', m)
}

export default isChain
