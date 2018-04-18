/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isFunctor from './isFunctor.js'

// isExtend : a -> Boolean
function isExtend(m) {
  return isFunctor(m)
    && hasAlg('extend', m)
}

export default isExtend
