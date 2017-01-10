/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')

function either(lf, rf, m) {
  if(!isFunction(lf) || !isFunction(rf)) {
    throw new TypeError('either: first two arguments must be functions')
  }
  else if(!(m && isFunction(m.either))) {
    throw new TypeError('either: Last argument must be an Either or Maybe')
  }

  return m.either(lf, rf)
}

module.exports = curry(either)
