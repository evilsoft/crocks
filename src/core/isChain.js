/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isApply from './isApply'

// isChain : a -> Boolean
export default function isChain(m) {
  return isApply(m)
    && hasAlg('chain', m)
}
