/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/Pair')

const curry = require('../core/curry')
const isContravariant = require('../core/isContravariant')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const isSemigroupoid = require('../core/isSemigroupoid')

const valid = (x, y) =>
  isSameType(x, y)
    && isSemigroupoid(x)
    && isContravariant(x)
    && isFunction(x.first)
    && isFunction(x.second)

/** fanout :: m a b -> m a c -> m a (b, c) */
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
    'fanout: Both arguments must be Arrows, Functions, or Stars of the same type'
  )
}

module.exports = curry(fanout)
