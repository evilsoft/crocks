/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isContravariant from './isContravariant'
import isFunctor from './isFunctor'

// isProfunctor :: a -> Boolean
export default function isProfunctor(m) {
  return isContravariant(m)
    && isFunctor(m)
    && hasAlg('promap', m)
}
