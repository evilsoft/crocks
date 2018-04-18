/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isFunctor from './isFunctor.js'

// isAlt : a -> Boolean
function isAlt(m) {
  return isFunctor(m)
    && hasAlg('alt', m)
}

export default isAlt
