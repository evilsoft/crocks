/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isApplicative = require('../core/isApplicative')
const isArray = require('../core/isArray')
const isSameType = require('../core/isSameType')

/** ap :: Applicative m => m a -> m (a -> b) ->  m b */
function ap(m, x) {
  if(!((isApplicative(m) || isArray(m)) && isSameType(m, x))) {
    throw new TypeError('ap: Both arguments must be Applys of the same type')
  }

  if(isArray(x)) {
    return array.ap(m, x)
  }

  return x.ap(m)
}

module.exports = curry(ap)
