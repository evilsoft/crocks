/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'

// isSemigroupoid : a -> Boolean
function isSemigroupoid(m) {
  return !!m && hasAlg('compose', m)
}

export default isSemigroupoid
