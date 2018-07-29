/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Pair from '../core/Pair'

// branch : a -> Pair a a
export default function branch(x) {
  return Pair(x, x)
}
