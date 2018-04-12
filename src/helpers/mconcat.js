/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFoldable from '../core/isFoldable.js'
import isMonoid from '../core/isMonoid.js'
import mconcatMap from '../core/mconcatMap.js'

const identity = x => x

// mconcat : Monoid m => m -> ([ a ] | List a) -> m a
function mconcat(m, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mconcat: Monoid required for first argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mconcat: Foldable required for second argument'
    )
  }

  return mconcatMap(m, identity, xs)
}

export default curry(mconcat)
