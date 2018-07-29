/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from '../core/hasAlg'

// isSetoid : a -> Boolean
export default function isSetoid(m) {
  return !!m
    && hasAlg('equals', m)
}
