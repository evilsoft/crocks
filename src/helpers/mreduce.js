/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFoldable from '../core/isFoldable'
import isMonoid from '../core/isMonoid'
import mconcatMap from '../core/mconcatMap'

const identity = x => x

// mreduce : Monoid M => M -> ([ a ] | List a) -> a
function mreduce(m, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mreduce: Monoid required for first argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mreduce: Foldable required for second argument'
    )
  }

  return mconcatMap(m, identity, xs).valueOf()
}

export default curry(mreduce)
