/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg.js'
import isContravariant from '../core/isContravariant.js'
import isFunctor from '../core/isFunctor.js'

// isProfunctor : a -> Boolean
function isProfunctor(m) {
  return isFunctor(m)
    && isContravariant(m)
    && hasAlg('promap', m)
}

export default isProfunctor
