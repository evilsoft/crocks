/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isApplicative = require('../predicates/isApplicative')
const isArray = require('../predicates/isArray')
const isSameType = require('../predicates/isSameType')

const array = require('../internal/array')

// ap :: Applicative m => m a -> m (a -> b) ->  m b
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
