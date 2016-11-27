/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function execWith(x, m) {
  if(!(m && isFunction(m.execWith))) {
    throw new TypeError('execWith: State required for second argument')
  }

  return m.execWith(x)
}

module.exports = curry(execWith)
