/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isAlt from './isAlt'

// isPlus : a -> Boolean
export default function isPlus(m) {
  return isAlt(m)
    && (hasAlg('zero', m) || hasAlg('zero', m.constructor))
}
