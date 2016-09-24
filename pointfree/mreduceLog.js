/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isMonoid = require('../internal/isMonoid')
const isFunction = require('../internal/isFunction')

function mreduceLog(m, init, w) {
  if(!isMonoid(m)) {
    throw new TypeError('mreduceLog: Monoid required for first argument')
  }
  else if(!(m && isFunction(w.mreduceLog))) {
    throw new TypeError('mreduceLog: Writer required for second argument')
  }

  return w.mreduceLog(m, init)
}

module.exports = curry(mreduceLog)
