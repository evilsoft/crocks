/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const fl = require('../core/flNames')
const isExtend = require('../core/isExtend')
const isFunction = require('../core/isFunction')

// extend : Extend w => (w a -> b) -> w a -> w b
function extend(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('extend: Function required for first argument')
  }
  if(!isExtend(m)) {
    throw new TypeError('extend: Extend required for second argument')
  }

  return (m[fl.extend] || m.extend).call(m, fn)
}

module.exports = curry(extend)
