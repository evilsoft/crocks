/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isExtend = require('../predicates/isExtend')
const isFunction = require('../predicates/isFunction')

// extend : Extend w => (w a -> b) -> w a -> w b
function extend(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('extend: Function required for first argument')
  }
  if(!isExtend(m)) {
    throw new TypeError('extend: Extend required for second argument')
  }

  return m.extend(fn)
}

module.exports = curry(extend)
