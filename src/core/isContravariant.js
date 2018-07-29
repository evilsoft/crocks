/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'

// isContravariant : a -> Boolean
export default function isContravariant(m) {
  return !!m && hasAlg('contramap', m)
}
