/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'
import isFunctor from './isFunctor.js'

// isBifunctor : a -> Boolean
function isBifunctor(m) {
  return isFunctor(m)
    && hasAlg('bimap', m)
}

export default isBifunctor
