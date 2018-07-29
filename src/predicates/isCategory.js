/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg'
import isSemigroupoid from '../core/isSemigroupoid'

// isCategory : a -> Boolean
export default function isCategory(m) {
  return isSemigroupoid(m)
    && (hasAlg('id', m) || hasAlg('id', m.constructor))
}
