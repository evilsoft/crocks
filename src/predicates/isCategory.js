/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg.js'
import isSemigroupoid from '../core/isSemigroupoid.js'

// isCategory : a -> Boolean
function isCategory(m) {
  return isSemigroupoid(m)
    && hasAlg('id', m)
}

export default isCategory
