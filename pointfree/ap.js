/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isApplicative = require('../predicates/isApplicative')
const isSameType = require('../predicates/isSameType')

// ap :: Applicative m => m a -> m (a -> b) ->  m b
function ap(m, x) {
  if(!(isApplicative(m) && isSameType(m, x))) {
    throw new TypeError('ap: Both arguments must be Applys of the same type')
  }

  return x.ap(m)
}

module.exports = curry(ap)
