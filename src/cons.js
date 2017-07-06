/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isArray = require('./core/isArray')
const isFunction = require('./core/isFunction')

function cons(x, m) {
  if(isFunction(m.cons)) {
    return m.cons(x)
  }
  else if(isArray(m)) {
    return [ x ].concat(m)
  }

  throw new TypeError('cons: List or Array required for second argument')
}

module.exports = curry(cons)
