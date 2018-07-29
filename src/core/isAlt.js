/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'
import isFunctor from './isFunctor'

// isAlt : a -> Boolean
export default function isAlt(m) {
  return isFunctor(m)
    && hasAlg('alt', m)
}
