/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isFunctor from './isFunctor'

// isBifunctor : a -> Boolean
export default function isBifunctor(m) {
  return isFunctor(m)
    && hasAlg('bimap', m)
}
