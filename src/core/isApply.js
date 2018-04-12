/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isFunctor from './isFunctor.js'

// isApply : a -> Boolean
function isApply(m) {
  return isFunctor(m)
    && hasAlg('ap', m)
}

export default isApply
