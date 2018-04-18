/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg.js'

// isSetoid : a -> Boolean
function isSetoid(m) {
  return !!m
    && hasAlg('equals', m)
}

export default isSetoid

