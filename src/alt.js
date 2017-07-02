/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isAlt = require('./core/isAlt')
const isSameType = require('./core/isSameType')

// alt : Alt m => m a -> m a -> m a
function alt(m, x) {
  if(!(isAlt(m) && isSameType(m, x))) {
    throw new TypeError('alt: Both arguments must be Alts of the same type')
  }

  return x.alt(m)
}

module.exports = curry(alt)
