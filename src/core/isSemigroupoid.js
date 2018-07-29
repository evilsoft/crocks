/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'

// isSemigroupoid : a -> Boolean
export default function isSemigroupoid(m) {
  return !!m && hasAlg('compose', m)
}
