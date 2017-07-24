/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Arrow = require('../core/types').proxy('Arrow')
const Star = require('../core/types').proxy('Star')
const Pair = require('../core/Pair')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const valid = (x, y) =>
  (isSameType(Arrow, x) || isSameType(Star, y))
    && isSameType(x, y)

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

  throw new TypeError('fanout: Arrows, Functions or Stars of the same type required for both arguments')
}

module.exports = curry(fanout)
