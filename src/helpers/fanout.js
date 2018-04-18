/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Pair from '../core/Pair.js'

import curry from '../core/curry.js'
import isContravariant from '../core/isContravariant.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'
import isSemigroupoid from '../core/isSemigroupoid.js'

const valid = (x, y) =>
  isSameType(x, y)
    && isSemigroupoid(x)
    && isContravariant(x)
    && isFunction(x.first)
    && isFunction(x.second)

// fanout : m a b -> m a c -> m a (b, c)
function fanout(fst, snd) {
  if(isFunction(fst) && isFunction(snd)) {
    return x =>
      Pair(fst(x), snd(x))
  }

  if(valid(fst, snd)) {
    return fst.first()
      .compose(snd.second())
      .contramap(x => Pair(x, x))
  }

  throw new TypeError(
    'fanout: Arrows, Functions or Stars of the same type required for both arguments'
  )
}

export default curry(fanout)
