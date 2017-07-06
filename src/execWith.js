/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isFunction = require('./core/isFunction')

function execWith(x, m) {
  if(!(m && isFunction(m.execWith))) {
    throw new TypeError('execWith: State required for second argument')
  }

  return m.execWith(x)
}

module.exports = curry(execWith)
