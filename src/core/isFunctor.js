/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg'

// isFunctor : a -> Boolean
export default function isFunctor(m) {
  return !!m && hasAlg('map', m)
}
