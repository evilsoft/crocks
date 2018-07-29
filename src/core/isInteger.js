/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isNumber from './isNumber'

// isInteger : a -> Boolean
export default function isInteger(x) {
  return isNumber(x)
    && isFinite(x)
    && Math.floor(x) === x
}
