/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const branch = require('./branch')
const compose = require('./compose')
const first = require('../pointfree/first')
const second = require('../pointfree/second')

const Arrow = require('../crocks/Arrow')
const Star = require('../crocks/Star')

const valid = (x, y) =>
  (isSameType(Arrow, x) || isSameType(Star, y))
    && isSameType(x, y)

// fanout : m a b -> m a c -> m a (b, c)
function fanout(fst, snd) {
  if(isFunction(fst) && isFunction(snd)) {
    return compose(second(snd), first(fst), branch)
  } else if(valid(fst, snd)) {
    return first(fst)
      .concat(second(snd))
      .contramap(branch)
  } else {
    throw new TypeError('fanout: Arrows, Functions or Stars of the same type required for both arguments')
  }
}

module.exports = curry(fanout)
