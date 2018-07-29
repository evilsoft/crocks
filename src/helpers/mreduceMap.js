/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFoldable from '../core/isFoldable'
import isFunction from '../core/isFunction'
import isMonoid from '../core/isMonoid'
import mconcatMap from '../core/mconcatMap'

// mreduceMap :: Monoid M => M -> (b -> a) -> ( [ b ] | List b ) -> a
function mreduceMap(m, f, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mreduceMap: Monoid required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'mreduceMap: Function required for second argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mreduceMap: Foldable required for third argument'
    )
  }

  return mconcatMap(m, f, xs).valueOf()
}

export default curry(mreduceMap)
