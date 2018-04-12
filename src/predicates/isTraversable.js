/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg.js'
import isFunctor from '../core/isFunctor.js'

// isTraversable : a -> Boolean
function isTraversable(m) {
  return isFunctor(m)
    && hasAlg('traverse', m)
}

export default isTraversable
