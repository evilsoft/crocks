/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg'
import isFunctor from '../core/isFunctor'

// isTraversable : a -> Boolean
export default function isTraversable(m) {
  return isFunctor(m)
    && hasAlg('traverse', m)
}
