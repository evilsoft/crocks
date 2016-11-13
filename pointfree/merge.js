/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function merge(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('merge: Binary function required for first argument')
  }
  else if(!(m && isFunction(m.merge))) {
    throw new TypeError('merge: Pair required for second argument')
  }

  return m.merge(fn)
}

module.exports = curry(merge)
