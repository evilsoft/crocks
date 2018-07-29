/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isFunctor from './isFunctor'

// isExtend : a -> Boolean
export default function isExtend(m) {
  return isFunctor(m)
    && hasAlg('extend', m)
}
