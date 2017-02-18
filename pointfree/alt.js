/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isAlt = require('../predicates/isAlt')
const isSameType = require('../predicates/isSameType')

// alt :: Alt m => m a -> m a -> m a
function alt(m, x) {
  if(!(isAlt(m) && isSameType(m, x))) {
    throw new TypeError('alt: Both arguments must be Alts of the same type')
  }

  return x.alt(m)
}

module.exports = curry(alt)
